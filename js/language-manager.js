/**
 * Language Manager for GROUP AGECOSCO Website
 * Handles language switching, persistence, and dynamic content translation
 */

class LanguageManager {
    constructor() {
        // Load translations first (if provided globally)
        this.translations = typeof translations !== 'undefined' ? translations : {};

        // Determine initial language: prefer stored user choice, then browser lang, then default to English
        this.currentLanguage = 'en';
        try {
            const stored = this.getStoredLanguage?.();
            if (stored && this.translations[stored]) {
                this.currentLanguage = stored;
            } else if (navigator && navigator.language) {
                const nav = navigator.language.toLowerCase();
                if (nav.startsWith('fr') && this.translations['fr']) this.currentLanguage = 'fr';
                else if (nav.startsWith('en') && this.translations['en']) this.currentLanguage = 'en';
            }
        } catch (e) {
            // keep default 'en' on any error
        }
        this.init();
    }

    /**
     * Translate using the flat dictionary object { key: { en, fr } }
     */
    translateWithDictionaryObj(dict, lang) {
        if (!dict || typeof dict !== 'object') return;

        // Helper to lookup a key in the dictionary
        const lookup = (key) => {
            if (!key) return undefined;
            const entry = dict[key];
            if (!entry) return undefined;
            return entry[lang] || entry['en'] || undefined;
        };

        // Translate elements with data-i18n attributes
        const nodes = document.querySelectorAll('[data-i18n], [data-i18n-placeholder], [data-i18n-value]');
        nodes.forEach(node => {
            const k = node.getAttribute('data-i18n');
            if (k) {
                const v = lookup(k);
                if (v !== undefined) node.textContent = v;
            }
            const p = node.getAttribute('data-i18n-placeholder');
            if (p) {
                const v = lookup(p);
                if (v !== undefined) node.setAttribute('placeholder', v);
            }
            const val = node.getAttribute('data-i18n-value');
            if (val) {
                const v = lookup(val);
                if (v !== undefined) node.value = v;
            }
            const agree = node.getAttribute('data-i18n-agree');
            if (agree) {
                const v = lookup(agree);
                if (v !== undefined) node.textContent = v;
            }
        });
    }

    /**
     * Translate missing dictionary entries using an online service (LibreTranslate by default)
     * Options: { endpoint, apiKey (optional), source: 'en', target: 'fr' }
     */
    async translateMissingWithOnlineService(options = {}) {
        const endpoint = options.endpoint || 'https://libretranslate.com/translate';
        const apiKey = options.apiKey || null;
        const source = options.source || 'en';
        const target = options.target || 'fr';

        if (!navigator.onLine) {
            console.log('Offline — skipping online translation');
            return;
        }

        // Load cache from localStorage
        let cache = {};
        try {
            const raw = localStorage.getItem('agecosco_i18n_cache');
            if (raw) cache = JSON.parse(raw);
        } catch (e) {
            console.warn('Could not read i18n cache', e);
            cache = {};
        }

        // Collect keys that are missing for the target language
        const missing = [];
        for (const k of Object.keys(dictionary)) {
            const entry = dictionary[k] || {};
            if ((!entry[target] || entry[target].trim() === '') && entry[source] && entry[source].trim() !== '') {
                missing.push({ key: k, text: entry[source].trim() });
            }
        }

        if (!missing.length) {
            console.log('No missing translations found for', target);
            return;
        }

        // Batch translate in small groups to avoid rate limits
        const batchSize = 5;
        for (let i = 0; i < missing.length; i += batchSize) {
            const batch = missing.slice(i, i + batchSize);
            // Prepare promises
            const promises = batch.map(item => {
                const cacheKey = `${target}::${item.text}`;
                if (cache[cacheKey]) return Promise.resolve({ key: item.key, text: cache[cacheKey] });
                return this.onlineTranslate(endpoint, apiKey, item.text, source, target)
                    .then(translated => ({ key: item.key, text: translated }))
                    .catch(err => {
                        console.warn('Online translate failed for', item.key, err);
                        return null;
                    });
            });

            const results = await Promise.all(promises);

            // Apply results and update cache
            for (const res of results) {
                if (!res) continue;
                dictionary[res.key] = dictionary[res.key] || { en: '', fr: '' };
                dictionary[res.key][target] = res.text;
                cache[`${target}::${(dictionary[res.key][source] || '').trim()}`] = res.text;
            }

            // Persist cache
            try {
                localStorage.setItem('agecosco_i18n_cache', JSON.stringify(cache));
            } catch (e) {
                console.warn('Could not persist i18n cache', e);
            }

            // Small delay between batches
            await new Promise(r => setTimeout(r, 300));
        }

        // Re-apply translations to the page now that dictionary is updated
        try {
            this.translateWithDictionaryObj(dictionary, this.currentLanguage);
            console.log('Applied online translations to page');
        } catch (e) {
            console.warn('Failed to re-apply translations after online translate', e);
        }
    }

    /**
     * Call the online translate endpoint (expects LibreTranslate-compatible API)
     */
    async onlineTranslate(endpoint, apiKey, text, source = 'en', target = 'fr') {
        try {
            const body = {
                q: text,
                source: source,
                target: target,
                format: 'text'
            };
            if (apiKey) body.api_key = apiKey;

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const txt = await res.text();
                throw new Error(`Translate API error: ${res.status} ${txt}`);
            }

            const data = await res.json();
            // LibreTranslate returns { translatedText: '...' }
            if (data && data.translatedText) return data.translatedText;
            // Some instances return array or other shape
            if (typeof data === 'string') return data;
            if (data && data[0] && data[0].translatedText) return data[0].translatedText;
            throw new Error('Unexpected translate response shape');
        } catch (e) {
            console.warn('onlineTranslate error', e);
            throw e;
        }
    }

    /**
     * Initialize the language manager
     */
    init() {
        console.log('🌐 Initializing LanguageManager...');
        console.log('  Current language:', this.currentLanguage);
        console.log('  Translations loaded:', Object.keys(this.translations));
        
        // Attach event listeners FIRST
        this.attachLanguageListeners();
        
        // Update document language attribute
        document.documentElement.lang = this.currentLanguage;
        
        // Translate page immediately on load (no transition)
        console.log('  Translating page to:', this.currentLanguage);
        this.translatePage();
        this.updateLanguageSelector();
        
        // Announce current language to screen readers
        this.announceLanguageChange();
        
        console.log('✅ LanguageManager initialization complete');

        // Also re-run translation after full page load (covers widgets like carousels)
        window.addEventListener('load', () => {
            try {
                this.translatePage();
                this.updateLanguageSelector();
                this.announceLanguageChange();
                console.log('🔁 Re-applied translations on window.load');
            } catch (e) {
                console.warn('Error re-applying translations on load:', e);
            }
        });

        // Extra safety: re-run once more after a short delay to catch late DOM replacements
        setTimeout(() => {
            try {
                this.translatePage();
                this.updateLanguageSelector();
                console.log('🔁 Re-applied translations after delay');
            } catch (e) {
                console.warn('Error re-applying translations after delay:', e);
            }
        }, 500);
    }

    /**
     * Get stored language from localStorage
     */
    getStoredLanguage() {
        try {
            return localStorage.getItem('agecosco_language') || null;
        } catch (e) {
            console.warn('localStorage not available:', e);
            return null;
        }
    }

    /**
     * Store language preference
     */
    storeLanguage(lang) {
        try {
            localStorage.setItem('agecosco_language', lang);
        } catch (e) {
            console.warn('Could not save language preference:', e);
        }
    }

    /**
     * Set active language
     */
    setLanguage(lang, updateContent = true) {
        // Allow switching even if translations object is missing.
        // We will still apply dictionary-based and data-i18n translations.
        if (!this.translations || !this.translations[lang]) {
            console.warn(`Translations for '${lang}' not found — proceeding with dictionary/data-i18n only`);
        }

        // Add transition effect
        if (updateContent) {
            document.body.setAttribute('data-lang-transition', 'true');
            document.body.classList.add('fade-out');
        }

        this.currentLanguage = lang;
        this.storeLanguage(lang);
        document.documentElement.lang = lang;

        if (updateContent) {
            // Delay content update for smooth transition
            setTimeout(() => {
                this.translatePage();
                this.updateLanguageSelector();
                this.announceLanguageChange();
                
                // Remove transition effect
                setTimeout(() => {
                    document.body.classList.remove('fade-out');
                    document.body.removeAttribute('data-lang-transition');
                }, 50);
            }, 100);
        }
    }

    /**
     * Translate the current page
     */
    translatePage() {
    // Provide the translations object for the current language to helper methods
    const t = (this.translations && this.translations[this.currentLanguage]) ? this.translations[this.currentLanguage] : (this.translations && this.translations['en']) || {};
    this.translateDataI18nElements(t);
    this.translateAllTextContent(t);
    // Ensure section-specific translators run as well (hero, navigation, about, services, etc.)
    try {
        this.translatePageHeaders?.(t);
        this.translateNavigation?.(t);
        this.translateHero?.(t);
        this.translateServices?.(t);
        this.translateServicesOverview?.(t);
        this.translateAbout?.(t);
        this.translateRealizations?.(t);
        this.translateProjects?.(t);
        this.translateAccreditations?.(t);
        this.translateTeam?.(t);
        this.translateTestimonials?.(t);
        this.translateFooter?.(t);
        this.translateButtons?.(t);
        this.translateCommonElements?.(t);
    } catch (e) {
        console.warn('Error running section translators:', e);
    }
        // Prefer dictionary lookup when available, and also apply raw-text fallback
        try {
            if (typeof dictionary !== 'undefined' && dictionary) {
                this.translateWithDictionaryObj(dictionary, this.currentLanguage);
                // Fallback for elements without data-i18n: match raw text to dictionary entries
                this.translateWithDictionary(this.currentLanguage);
            } else {
                // last-resort: use existing translations object via raw text matching
                this.translateWithDictionary(this.currentLanguage);
            }
        } catch (e) {
            console.warn('Dictionary lookup failed, falling back to old method:', e);
            try { this.translateWithDictionary(this.currentLanguage); } catch (ee) { /* ignore */ }
        }
    }

    /**
     * NEW: Comprehensive text content translation for ALL pages
     * FIXED: Complete rewrite for reliability
     */
    translateAllTextContent(t) {
        // Direct translation map - comprehensive
        const translationMap = {
            // Navigation
            'Home': t.nav.home,
            'Accueil': t.nav.home,
            'About': t.nav.about,
            'À Propos': t.nav.about,
            'About Us': t.nav.about,
            'Branches': t.nav.branches,
            'Services': t.nav.services,
            'Contact': t.nav.contact,
            'Contact Us': t.nav.contact,
            'Contactez-Nous': t.nav.contact,
            'Languages': t.nav.languages,
            'Langues': t.nav.languages,
            
            // About dropdown
            'Quality and policy': t.nav.aboutDropdown.quality,
            'Qualité et Politique': t.nav.aboutDropdown.quality,
            'Our Team': t.nav.aboutDropdown.team,
            'Notre Équipe': t.nav.aboutDropdown.team,
            'Health and Safety': t.nav.aboutDropdown.health,
            'Santé et Sécurité': t.nav.aboutDropdown.health,
            'General conditions of the Service': t.nav.aboutDropdown.conditions,
            'Conditions Générales du Service': t.nav.aboutDropdown.conditions,
            
            // Services dropdown
            'Tally Inspections and Supervisions': t.nav.servicesDropdown.tally,
            'Inspections et Supervisions de Pointage': t.nav.servicesDropdown.tally,
            'Surveys': t.nav.servicesDropdown.surveys,
            'Expertises': t.nav.servicesDropdown.surveys,
            'Surveys (pre-loading, discharge and damage surveys)': t.nav.servicesDropdown.surveys,
            'P&I Claims Handling': t.nav.servicesDropdown.claims,
            'Gestion des Réclamations P&I': t.nav.servicesDropdown.claims,
            'Loss prevention plans': t.nav.servicesDropdown.loss,
            'Plans de Prévention des Pertes': t.nav.servicesDropdown.loss,
            'Risk and management': t.nav.servicesDropdown.risk,
            'Risk Management': t.nav.servicesDropdown.risk,
            'Gestion des Risques': t.nav.servicesDropdown.risk,
            'Fruit and perishables': t.nav.servicesDropdown.fruit,
            'Fruits et Denrées Périssables': t.nav.servicesDropdown.fruit,
            'Agrifood sector': t.nav.servicesDropdown.agrifood,
            'Secteur Agroalimentaire': t.nav.servicesDropdown.agrifood,
            
            // Stats / Numbers
            'Happy Clients': t.about?.stats?.clients || 'Happy Clients',
            'Clients satisfaits': t.about?.stats?.clients || 'Clients satisfaits',
            'Projects Done': t.about?.stats?.projects || 'Projects Done',
            'Projets effectués': t.about?.stats?.projects || 'Projets effectués',
            
            // Buttons
            'Read More': t.buttons?.readMore || 'Read More',
            'En Savoir Plus': t.buttons?.readMore || 'Read More',
            'Learn More': t.buttons?.learnMore || 'Learn More',
            "Plus d'Info": t.buttons?.learnMore || 'Learn More',
            "Plus d'infos": t.buttons?.learnMore || 'Learn More',
            'Get Quote': t.buttons?.getQuote || 'Get Quote',
            'Obtenir un Devis': t.buttons?.getQuote || 'Get Quote',
            'Quotation': t.hero?.btnQuote || 'Quotation',
            'Devis': t.hero?.btnQuote || 'Devis',
            'Vérifiez': t.hero?.btnCheck || 'Check',
            'Check': t.hero?.btnCheck || 'Check'
        };
        
        // 1. Translate ALL links and buttons with the robust method
        this.translateElementsDirectly('a.nav-link', translationMap);
        this.translateElementsDirectly('a.dropdown-item', translationMap);
        this.translateElementsDirectly('.btn', translationMap);
        this.translateElementsDirectly('button', translationMap);
        
        // 2. NEW: Translate service card titles (h3, h5 headings)
        this.translateElementsDirectly('h3.text-white', translationMap);
        this.translateElementsDirectly('h5.text-white', translationMap);
        this.translateElementsDirectly('.card-title', translationMap); // Added for card titles
        this.translateElementsDirectly('.card-text', translationMap); // Added for card descriptions

        // 2b. Translate page headers universally (h1 titles)
        this.translateElementsDirectly('.page-header h1, header h1', translationMap);
        
        // 3. NEW: Translate stats labels
        this.translateElementsDirectly('p.text-primary', translationMap);
        this.translateElementsDirectly('.fw-medium', translationMap);
        
        // 4. Translate language selector specifically
        this.translateLanguageSelector(t);
        
        // 5. Translate Topbar
        this.translateTopbarHours(t);
        
        // 6. Translate breadcrumbs
        this.translateBreadcrumbs(t);
        
        // 7. Translate Footer
        this.translateFooterComplete(t);
    }
    
    /**
     * FIXED: Direct element translation - no complex logic
     */
    translateElementsDirectly(selector, translationMap) {
        const elements = document.querySelectorAll(selector);
        let translatedCount = 0;

        // Normalisation légère pour correspondances robustes (espaces, casse, ponctuation simple)
        const normalize = (str) => str
            .replace(/\s+/g, ' ')         // espaces multiples → simple espace
            .replace(/[\u00A0]/g, ' ')     // espace insécable → espace
            .replace(/[\s]*[:;,.]+$/,'')   // ponctuation finale courante
            .trim()
            .toLowerCase();

        // Construire une table normalisée en plus de la table exacte
        const normalizedMap = {};
        Object.keys(translationMap).forEach(k => {
            normalizedMap[normalize(k)] = translationMap[k];
        });

        elements.forEach(element => {
            // Texte complet de l'élément
            const fullText = element.textContent.trim();
            const normText = normalize(fullText);

            // Préférer la correspondance exacte, sinon utiliser la normalisée
            const target = translationMap[fullText] || normalizedMap[normText];
            if (target) {
                const icon = element.querySelector('i');
                if (icon) {
                    const iconHTML = icon.outerHTML;
                    element.innerHTML = iconHTML + ' ' + target;
                } else {
                    element.textContent = target;
                }
                translatedCount++;
            }
        });

        if (translatedCount > 0) {
            console.log(`  ✅ Translated ${translatedCount} ${selector} element(s)`);
        }
    }
    
    /**
     * FIXED: Language selector translation
     */
    translateLanguageSelector(t) {
        const langSelector = document.querySelector('.nav-link.dropdown-toggle[aria-label*="Language"], .dropdown-toggle:has(.fa-globe)');
        
        if (langSelector) {
            const globe = langSelector.querySelector('i.fa-globe');
            if (globe) {
                langSelector.innerHTML = globe.outerHTML + ' ' + t.nav.languages;
            } else {
                langSelector.textContent = t.nav.languages;
            }
        }
    }
    
    /**
     * FIXED: Breadcrumb translation
     */
    translateBreadcrumbs(t) {
        // Find all breadcrumb links
        const breadcrumbLinks = document.querySelectorAll('.breadcrumb-item a');
        
        breadcrumbLinks.forEach(link => {
            const text = link.textContent.trim();
            const href = link.getAttribute('href') || '';
            
            // Translate based on href or text
            if (href.includes('index') || text === 'Home' || text === 'Accueil') {
                link.textContent = t.nav.home;
            } else if (href.includes('about') || text === 'About' || text === 'À Propos') {
                link.textContent = t.nav.about;
            } else if (href.includes('service') || text === 'Services') {
                link.textContent = t.nav.services;
            } else if (href.includes('branch') || text === 'Branches') {
                link.textContent = t.nav.branches;
            } else if (href.includes('contact') || text === 'Contact' || text === 'Contactez-Nous') {
                link.textContent = t.nav.contact;
            }
        });
    }
    
    /**
     * Translate topbar hours specifically
     */
    translateTopbarHours(t) {
        const topbar = document.querySelector('.container-fluid.bg-dark');
        if (!topbar) return;
        
        // Find the clock icon element
        const clockParent = topbar.querySelector('.d-inline-flex:has(.fa-clock)');
        if (!clockParent) return;
        
        const small = clockParent.querySelector('small:not(:has(i))');
        if (small) {
            const currentText = small.textContent.trim();
            // Only translate if it contains hours information
            if (currentText.includes('Lun') || currentText.includes('Mon') || currentText.includes('9') || currentText.includes('H') || currentText.includes('AM') || currentText.includes('PM')) {
                small.textContent = t.topbar.hours;
            }
        }
    }
    
    /**
     * Complete footer translation
     */
    translateFooterComplete(t) {
        const footer = document.querySelector('.footer, footer');
        if (!footer) return;
        
        // Footer headings - use direct translation
        const footerHeadings = footer.querySelectorAll('h5, h4');
        const headingMap = {
            'Adresse': t.footer?.address || 'Address',
            'Address': t.footer?.address || 'Address',
            'Services': t.footer?.servicesTitle || 'Services',
            'Menu': t.footer?.menuTitle || 'Quick Links',
            'Quick Links': t.footer?.menuTitle || 'Quick Links',
            "Bulletin d'information": t.footer?.newsletterTitle || 'Newsletter',
            'Newsletter': t.footer?.newsletterTitle || 'Newsletter'
        };
        
        footerHeadings.forEach(heading => {
            const text = heading.textContent.trim();
            if (headingMap[text]) {
                heading.textContent = headingMap[text];
            }
        });
        
        // Newsletter elements
        const newsletterInput = footer.querySelector('input[type="text"], input[type="email"]');
        if (newsletterInput) {
            newsletterInput.placeholder = t.footer?.newsletterPlaceholder || 'Your email';
        }
        
        const newsletterBtn = footer.querySelector('.btn-primary, button[type="submit"]');
        if (newsletterBtn) {
            const btnText = newsletterBtn.textContent.trim();
            if (btnText.includes('Inscrire') || btnText.includes('Subscribe')) {
                newsletterBtn.textContent = t.footer?.newsletterBtn || 'Subscribe';
            }
        }
        
        // Footer links
        const footerLinks = footer.querySelectorAll('a.btn-link, .btn.btn-link');
        const linkMap = {
            'Home': t.nav?.home || 'Home',
            'Accueil': t.nav?.home || 'Accueil',
            'About': t.nav?.about || 'About',
            'À Propos': t.nav?.about || 'À Propos',
            'Our Services': t.nav?.services || 'Services',
            'Nos Services': t.nav?.services || 'Services',
            'Services': t.nav?.services || 'Services',
            'Branches': t.nav?.branches || 'Branches',
            'Contact': t.nav?.contact || 'Contact',
            'Contactez-Nous': t.nav?.contact || 'Contact'
        };
        
        footerLinks.forEach(link => {
            const text = link.textContent.trim();
            if (linkMap[text]) {
                link.textContent = linkMap[text];
            }
        });
    }

    /**
     * NEW: Universal translation using data-i18n attributes
     * This works on ALL pages automatically
     */
    translateDataI18nElements(t) {
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(element => {
            const key = element.getAttribute('data-i18n');
            const translation = this.getNestedTranslation(t, key);
            if (translation) {
                element.textContent = translation;
            }
        });
    }

    /**
     * NEW: Translate page headers and breadcrumbs (universal for all pages)
     */
    translatePageHeaders(t) {
        // Page title (h1 in page header)
        const pageTitle = document.querySelector('.page-header h1, header h1');
        if (pageTitle) {
            const titleText = pageTitle.textContent.trim();
            
            // Map page titles to translation keys
            const titleMap = {
                'About Us': t.about?.heading || 'About Us',
                'À Propos': t.about?.heading || 'À Propos',
                'Our Services': t.servicesOverview?.heading || 'Services',
                'Services': t.servicesOverview?.heading || 'Services',
                'Contact Us': 'Contact Us',
                'Contactez-Nous': 'Contact Us',
                'Our Team': t.team?.heading || 'Our Team',
                'Notre Équipe': t.team?.heading || 'Notre Équipe',
                'Our Branches': 'Our Branches',
                'Nos Branches': 'Our Branches'
            };
            
            if (titleMap[titleText]) {
                pageTitle.textContent = titleMap[titleText];
            }
        }
        
        // Breadcrumb items
        const breadcrumbHome = document.querySelector('.breadcrumb-item a[href*="index"]');
        if (breadcrumbHome) breadcrumbHome.textContent = t.nav.home;
        
        const breadcrumbAbout = document.querySelector('.breadcrumb-item a[href*="about"]');
        if (breadcrumbAbout) breadcrumbAbout.textContent = t.nav.about;
        
        const breadcrumbServices = document.querySelector('.breadcrumb-item a[href*="service"]');
        if (breadcrumbServices) breadcrumbServices.textContent = t.nav.services;
    }

    /**
     * NEW: Translate all buttons universally
     */
    translateButtons(t) {
        // Get all buttons
        const allButtons = document.querySelectorAll('.btn');
        
        allButtons.forEach(btn => {
            const text = btn.textContent.trim();
            
            // Common button translations
            const buttonMap = {
                'Read More': t.buttons?.readMore || 'Read More',
                'En Savoir Plus': t.buttons?.readMore || 'En Savoir Plus',
                'Learn More': t.buttons?.learnMore || 'Learn More',
                'Plus d\'Info': t.buttons?.learnMore || 'Plus d\'Info',
                'Plus d\'infos': t.buttons?.learnMore || 'Plus d\'infos',
                'Contact Us': t.nav?.contact || 'Contact Us',
                'Contactez-Nous': t.nav?.contact || 'Contactez-Nous',
                'Get Quote': t.buttons?.getQuote || 'Get Quote',
                'Obtenir un Devis': t.buttons?.getQuote || 'Obtenir un Devis',
                'Quotation': t.hero?.btnQuote || 'Quotation',
                'Devis': t.hero?.btnQuote || 'Devis',
                'Vérifiez': t.hero?.btnCheck || 'Check',
                'Check': t.hero?.btnCheck || 'Check'
            };
            
            // Only translate if we have a mapping
            if (buttonMap[text]) {
                // Preserve any icons
                const icon = btn.querySelector('i');
                if (icon) {
                    const iconHTML = icon.outerHTML;
                    btn.innerHTML = iconHTML + buttonMap[text];
                } else {
                    btn.textContent = buttonMap[text];
                }
            }
        });
    }

    /**
     * Translate navigation elements - IMPROVED for all pages
     */
    translateNavigation(t) {
        // Main navigation links
        const homeLink = document.querySelector('.navbar-nav a[href*="index.html"]');
        if (homeLink && !homeLink.classList.contains('dropdown-item')) {
            homeLink.textContent = t.nav.home;
        }

        const aboutLink = document.querySelector('.navbar-nav a[href*="about.html"]:not(.dropdown-item)');
        if (aboutLink) aboutLink.textContent = t.nav.about;

        const branchesLink = document.querySelector('.navbar-nav a[href*="branches.html"]');
        if (branchesLink) branchesLink.textContent = t.nav.branches;

        const servicesLink = document.querySelector('.navbar-nav a[href*="service.html"]:not(.dropdown-item)');
        if (servicesLink) servicesLink.textContent = t.nav.services;

        const contactLink = document.querySelector('.navbar-nav a[href*="contact.html"]:not(.dropdown-item)');
        if (contactLink) {
            contactLink.textContent = t.nav.contact;
        }

        // Language selector - preserve icon
        const languagesLink = document.querySelector('.navbar-nav .dropdown-toggle[aria-label*="Language"], .navbar-nav .dropdown-toggle:has(+ .dropdown-menu a[lang])');
        if (languagesLink) {
            const icon = languagesLink.querySelector('i.fa-globe');
            if (icon) {
                languagesLink.innerHTML = icon.outerHTML + t.nav.languages;
            } else {
                languagesLink.textContent = t.nav.languages;
            }
        }

        // About dropdown items
        const qualityLink = document.querySelector('.dropdown-item[href*="quality-policy"]');
        if (qualityLink) qualityLink.textContent = t.nav.aboutDropdown.quality;

        const teamDropdownLink = document.querySelector('.dropdown-item[href*="team.html"]');
        if (teamDropdownLink) teamDropdownLink.textContent = t.nav.aboutDropdown.team;

        const healthLink = document.querySelector('.dropdown-item[href*="health-safety"]');
        if (healthLink) healthLink.textContent = t.nav.aboutDropdown.health;

        const conditionsLink = document.querySelector('.dropdown-item[href*="general-conditions"]');
        if (conditionsLink) conditionsLink.textContent = t.nav.aboutDropdown.conditions;

        // Services dropdown items
        const tallyLink = document.querySelector('.dropdown-item[href*="tally-inspection"]');
        if (tallyLink) tallyLink.textContent = t.nav.servicesDropdown.tally;

        const surveysLink = document.querySelector('.dropdown-item[href*="survey.html"]');
        if (surveysLink) surveysLink.textContent = t.nav.servicesDropdown.surveys;

        const claimsLink = document.querySelector('.dropdown-item[href*="p-i-claims"]');
        if (claimsLink) claimsLink.textContent = t.nav.servicesDropdown.claims;

        const lossLink = document.querySelector('.dropdown-item[href*="loss-prevent"]');
        if (lossLink) lossLink.textContent = t.nav.servicesDropdown.loss;

        const riskLink = document.querySelector('.dropdown-item[href*="risk.html"]');
        if (riskLink) riskLink.textContent = t.nav.servicesDropdown.risk;

        const fruitLink = document.querySelector('.dropdown-item[href*="fruit-perish"]');
        if (fruitLink) fruitLink.textContent = t.nav.servicesDropdown.fruit;

        const agrifoodLink = document.querySelector('.dropdown-item[href*="agri-food"]');
        if (agrifoodLink) agrifoodLink.textContent = t.nav.servicesDropdown.agrifood;
    }

    /**
     * Translate topbar elements - IMPROVED for all pages
     */
    translateTopbar(t) {
        // Find the hours element in topbar
        const topbar = document.querySelector('.container-fluid.bg-dark, .topbar');
        if (!topbar) return;
        
        // Look for the clock icon and translate the hours text
        const clockElements = topbar.querySelectorAll('small:has(.fa-clock), small:has(.far.fa-clock)');
        clockElements.forEach(elem => {
            const textNode = Array.from(elem.childNodes).find(node => node.nodeType === 3);
            if (textNode) {
                const currentText = textNode.textContent.trim();
                // Only translate if it looks like hours
                if (currentText.includes('Lun') || currentText.includes('Mon') || currentText.includes('9') || currentText.includes('H')) {
                    textNode.textContent = t.topbar.hours;
                }
            }
        });
        
        // Alternative: find by parent structure
        const hoursWrapper = topbar.querySelector('.h-100.d-inline-flex:has(.fa-clock)');
        if (hoursWrapper) {
            const small = hoursWrapper.querySelector('small:not(:has(i))');
            if (small) {
                small.textContent = t.topbar.hours;
            }
        }
    }

    /**
     * Translate hero/carousel section
     */
    translateHero(t) {
        const carouselItems = document.querySelectorAll('.owl-carousel-item, .carousel-item');
        
        carouselItems.forEach((item, index) => {
            const title = item.querySelector('h1');
            const description = item.querySelector('p.fs-5');
            const buttons = item.querySelectorAll('.btn');

            if (index === 0 && title) title.textContent = t.hero.title1;
            if (index === 0 && description) description.textContent = t.hero.description1;
            if (index === 1 && title) title.textContent = t.hero.title2;
            if (index === 1 && description) description.textContent = t.hero.description2;
            if (index === 2 && title) title.textContent = t.hero.title3;
            if (index === 2 && description) description.textContent = t.hero.description3;

            // Translate buttons
            if (buttons.length >= 2) {
                const btnTexts = [t.hero.btnCheck, t.hero.btnReadMore, t.hero.btnMoreInfo];
                buttons.forEach((btn, btnIndex) => {
                    if (btnTexts[btnIndex]) {
                        const textContent = btn.textContent.trim();
                        if (textContent.includes('Vérif') || textContent.includes('Check')) {
                            btn.textContent = t.hero.btnCheck;
                        } else if (textContent.includes('Quot') || textContent.includes('Devis')) {
                            btn.textContent = t.hero.btnQuote;
                        } else if (textContent.includes('Read') || textContent.includes('Savoir')) {
                            btn.textContent = t.hero.btnReadMore;
                        } else if (textContent.includes('Info')) {
                            btn.textContent = t.hero.btnMoreInfo;
                        }
                    }
                });
            }
        });
    }

    /**
     * Translate main services section (Facts section)
     */
    translateServices(t) {
        const serviceBoxes = document.querySelectorAll('.container-xxl.py-5 .bg-dark');
        
        if (serviceBoxes.length >= 3) {
            // Service 1
            const service1Title = serviceBoxes[0].querySelector('h5, h3');
            const service1Desc = serviceBoxes[0].querySelector('p, span');
            if (service1Title) service1Title.textContent = t.services.service1.title;
            if (service1Desc) service1Desc.textContent = t.services.service1.description;

            // Service 2
            const service2Title = serviceBoxes[1].querySelector('h5, h3');
            const service2Desc = serviceBoxes[1].querySelector('p, span');
            if (service2Title) service2Title.textContent = t.services.service2.title;
            if (service2Desc) service2Desc.textContent = t.services.service2.description;

            // Service 3
            const service3Title = serviceBoxes[2].querySelector('h5, h3');
            const service3Desc = serviceBoxes[2].querySelector('p, span');
            if (service3Title) service3Title.textContent = t.services.service3.title;
            if (service3Desc) service3Desc.textContent = t.services.service3.description;
        }
    }

    /**
     * Translate about section
     */
    translateAbout(t) {
        const aboutSection = document.querySelector('.container.about, .about-text');
        if (!aboutSection) return;

        const heading = aboutSection.querySelector('h1, h2');
        if (heading && heading.textContent.includes('Propos') || heading?.textContent.includes('About')) {
            heading.textContent = t.about.title;
        }

        const paragraphs = aboutSection.querySelectorAll('p');
        if (paragraphs.length >= 3) {
            paragraphs[0].textContent = t.about.paragraph1;
            if (paragraphs[1]) paragraphs[1].textContent = t.about.paragraph2;
            if (paragraphs[2]) paragraphs[2].textContent = t.about.paragraph3;
        }

        // Stats
        const statsLabels = aboutSection.querySelectorAll('.fw-medium.text-primary');
        if (statsLabels[0]) statsLabels[0].textContent = t.about.stats.clients;
        if (statsLabels[1]) statsLabels[1].textContent = t.about.stats.projects;

        // Button
        const btn = aboutSection.querySelector('.btn');
        if (btn) btn.textContent = t.about.btnMore;
    }

    /**
     * Translate services overview section
     */
    translateServicesOverview(t) {
        const servicesSection = document.querySelector('.service-row');
        if (!servicesSection) return;

        const serviceItems = servicesSection.querySelectorAll('.service-item');
        
        serviceItems.forEach((item, index) => {
            const title = item.querySelector('h4, h3');
            const description = item.querySelector('p');
            const link = item.querySelector('a.btn');

            const serviceKey = `service${index + 1}`;
            if (t.servicesOverview[serviceKey]) {
                if (title) title.textContent = t.servicesOverview[serviceKey].title;
                if (description) description.textContent = t.servicesOverview[serviceKey].description;
                if (link) {
                    const iconHtml = link.querySelector('i') ? link.querySelector('i').outerHTML : '';
                    link.innerHTML = iconHtml + t.servicesOverview[serviceKey].btnReadMore;
                }
            }
        });
    }

    /**
     * Translate realizations section
     */
    translateRealizations(t) {
        const realizationsSection = document.querySelector('.container.feature');
        if (!realizationsSection) return;

        const heading = realizationsSection.querySelector('h1, h2');
        if (heading) heading.textContent = t.realizations.heading;

        const title = realizationsSection.querySelector('h3, h5');
        const description = realizationsSection.querySelector('p.mb-4');
        if (title) title.textContent = t.realizations.title;
        if (description) description.textContent = t.realizations.description;

        // Feature items
        const featureItems = realizationsSection.querySelectorAll('.d-flex.align-items-center');
        featureItems.forEach((item, index) => {
            const label = item.querySelector('.text-primary');
            const title = item.querySelector('h5, h4');
            
            const featureKeys = ['trusted', 'quality', 'smart', 'hours'];
            const itemKeys = ['inspections', 'prevention', 'risk', 'surveys'];
            
            if (label && featureKeys[index]) {
                label.textContent = t.realizations.features[featureKeys[index]];
            }
            if (title && itemKeys[index]) {
                title.textContent = t.realizations.items[itemKeys[index]];
            }
        });
    }

    /**
     * Translate projects/portfolio section
     */
    translateProjects(t) {
        const baseElem = document.querySelector('#projects-heading, .portfolio-container');
        let projectsHeading = null;
        if (baseElem) {
            const container = baseElem.closest('.container');
            if (container) {
                projectsHeading = container.querySelector('h1, h2');
            }
        }
        if (projectsHeading) projectsHeading.textContent = t.projects.heading;

        // Filter buttons
        const filterBtns = document.querySelectorAll('#portfolio-flters li');
        if (filterBtns.length >= 3) {
            filterBtns[0].textContent = t.projects.filter.all;
            filterBtns[1].textContent = t.projects.filter.completed;
            filterBtns[2].textContent = t.projects.filter.ongoing;
        }
    }

    /**
     * Translate accreditations section
     */
    translateAccreditations(t) {
        // Defensive: ensure the base element exists before calling .closest()
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return; // nothing to translate on this page

        const container = carousel.closest('.container');
        if (!container) return;

        const accreditationsHeading = container.querySelector('h1');
        if (accreditationsHeading && accreditationsHeading.textContent && accreditationsHeading.textContent.includes('Accred')) {
            accreditationsHeading.textContent = t.accreditations.heading;
        }
    }

    /**
     * Translate team section
     */
    translateTeam(t) {
        const teamHeading = document.querySelector('#team-heading');
        if (teamHeading) teamHeading.textContent = t.team.heading;

        // Team positions
        const positions = document.querySelectorAll('.team-item .text-primary');
        positions.forEach(position => {
            const text = position.textContent.trim();
            if (text === 'CEO' || text === 'PDG') {
                position.textContent = t.team.ceo;
            } else if (text.includes('Manager')) {
                position.textContent = t.team.manager;
            } else if (text.includes('Chef') || text.includes('Project')) {
                position.textContent = t.team.projectManager;
            }
        });
    }

    /**
     * Translate testimonials section
     */
    translateTestimonials(t) {
        const testimonialsHeading = document.querySelector('.testimonial-carousel')?.closest('.container')?.querySelector('h1');
        if (testimonialsHeading && testimonialsHeading.textContent.includes('moign')) {
            testimonialsHeading.textContent = t.testimonials.heading;
        }
    }

    /**
     * Translate footer - IMPROVED to work on ALL pages
     */
    translateFooter(t) {
        const footer = document.querySelector('.footer, footer');
        if (!footer) return;

        // Footer headings
        const headings = footer.querySelectorAll('h5, h4');
        headings.forEach(heading => {
            const text = heading.textContent.trim();
            
            const headingMap = {
                'Adresse': t.footer?.address || 'Address',
                'Address': t.footer?.address || 'Address',
                'Services': t.footer?.servicesTitle || 'Services',
                'Menu': t.footer?.menuTitle || 'Quick Links',
                'Quick Links': t.footer?.menuTitle || 'Quick Links',
                "Bulletin d'information": t.footer?.newsletterTitle || 'Newsletter',
                'Newsletter': t.footer?.newsletterTitle || 'Newsletter'
            };
            
            if (headingMap[text]) {
                heading.textContent = headingMap[text];
            }
        });

        // Newsletter description
        const newsletterDesc = footer.querySelector('p:has(+ .position-relative), p:has(+ input)');
        if (newsletterDesc && newsletterDesc.textContent.includes('Suivez') || newsletterDesc?.textContent.includes('Stay')) {
            newsletterDesc.textContent = t.footer?.newsletterDescription || newsletterDesc.textContent;
        }

        // Newsletter input placeholder
        const newsletterInput = footer.querySelector('input[type="text"], input[type="email"]');
        if (newsletterInput) {
            newsletterInput.placeholder = t.footer?.newsletterPlaceholder || 'Your email';
        }

        // Newsletter button
        const newsletterBtn = footer.querySelector('.btn-primary, button[type="submit"]');
        if (newsletterBtn && (newsletterBtn.textContent.includes('Inscrire') || newsletterBtn.textContent.includes('Subscribe'))) {
            newsletterBtn.textContent = t.footer?.newsletterBtn || 'Subscribe';
        }
        
        // Footer links - translate common ones
        const footerLinks = footer.querySelectorAll('a.btn-link, .btn.btn-link');
        footerLinks.forEach(link => {
            const text = link.textContent.trim();
            
            // Map footer link texts
            const linkMap = {
                'Home': t.nav?.home || 'Home',
                'Accueil': t.nav?.home || 'Accueil',
                'About': t.nav?.about || 'About',
                'À Propos': t.nav?.about || 'À Propos',
                'Our Services': t.servicesOverview?.heading || 'Services',
                'Nos Services': t.servicesOverview?.heading || 'Services',
                'Services': t.servicesOverview?.heading || 'Services',
                'Branches': t.nav?.branches || 'Branches',
                'Contact': t.nav?.contact || 'Contact'
            };
            
            if (linkMap[text]) {
                link.textContent = linkMap[text];
            }
        });
    }

    /**
     * Translate common elements
     */
    translateCommonElements(t) {
        // Section headings
        const sectionHeadings = document.querySelectorAll('[id$="-heading"]');
        sectionHeadings.forEach(heading => {
            const id = heading.id;
            if (id.includes('services') && t.servicesOverview.heading) {
                heading.textContent = t.servicesOverview.heading;
            } else if (id.includes('projects') && t.projects.heading) {
                heading.textContent = t.projects.heading;
            } else if (id.includes('team') && t.team.heading) {
                heading.textContent = t.team.heading;
            }
        });
    }

    /**
     * Update language selector UI
     */
    updateLanguageSelector() {
        // Select any element that exposes a data-lang attribute (works with navbar dropdown links)
        const languageButtons = document.querySelectorAll('[data-lang]');
        languageButtons.forEach(button => {
            const lang = button.getAttribute('data-lang');
            if (lang === this.currentLanguage) {
                button.classList.add('active');
                button.setAttribute('aria-current', 'true');
            } else {
                button.classList.remove('active');
                button.removeAttribute('aria-current');
            }

            // Toggle visibility of the check icon when present
            const check = button.querySelector('.fa-check');
            if (check) {
                check.style.opacity = (lang === this.currentLanguage) ? '1' : '0';
            }
        });
    }

    /**
     * Attach event listeners for language selection
     */
    attachLanguageListeners() {
        // Use event delegation so listeners survive DOM replacements
        document.addEventListener('click', (ev) => {
            const target = ev.target.closest && ev.target.closest('[data-lang]');
            if (!target) return;
            ev.preventDefault();
            const selectedLang = target.getAttribute('data-lang');
            if (selectedLang) {
                this.setLanguage(selectedLang);
            }
        });
    }

    /**
     * Announce language change to screen readers
     */
    announceLanguageChange() {
        const announcement = document.createElement('div');
        announcement.setAttribute('role', 'status');
        announcement.setAttribute('aria-live', 'polite');
        announcement.className = 'visually-hidden';
        
        const langName = this.currentLanguage === 'fr' ? 'Français' : 'English';
        announcement.textContent = `Language changed to ${langName}`;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            if (document.body.contains(announcement)) {
                document.body.removeChild(announcement);
            }
        }, 1000);
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }

    /**
     * Get translation for a specific key
     */
    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLanguage];
        
        for (const k of keys) {
            if (value && typeof value === 'object' && k in value) {
                value = value[k];
            } else {
                return key; // Return key if translation not found
            }
        }
        
        return value;
    }

    /**
     * Safely retrieve a nested translation from the provided translation object `t`.
     * Accepts either an object `t` (translations for current language) or a fallback function.
     * key: dot-separated string like 'nav.home'
     */
    getNestedTranslation(tObj, key) {
        if (!tObj || !key) return undefined;
        // If tObj is a function (legacy), call it with full key
        if (typeof tObj === 'function') {
            try {
                return tObj(key);
            } catch (e) {
                return undefined;
            }
        }

        const parts = key.split('.');
        let cur = tObj;
        for (const p of parts) {
            if (cur && typeof cur === 'object' && p in cur) {
                cur = cur[p];
            } else {
                return undefined;
            }
        }
        return cur;
    }

    // Ajout d'une méthode pour traduction basée sur dictionary.js
    translateWithDictionary(lang) {
        if (typeof dictionary === 'undefined' || !dictionary) return;
        const elements = document.querySelectorAll('body, body *:not(script):not(style):not(noscript)');
        elements.forEach(el => {
            // Éviter les inputs, buttons, etc. qui ont déjà data-i18n
            if ((el.children.length > 0 && el.childElementCount === el.children.length) || el.hasAttribute('data-i18n')) return;
            if (el.childNodes.length === 1 && el.childNodes[0].nodeType === 3) {
                const text = el.textContent.trim();
                if (text && dictionary[text] && dictionary[text][lang] && el.textContent.trim() !== dictionary[text][lang]) {
                    el.textContent = dictionary[text][lang];
                }
            }
        });
    }
}

// Initialize language manager when DOM is ready
// FIXED: Use setTimeout to ensure translation happens AFTER all other scripts
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to let other scripts (main.js) finish initializing
    setTimeout(() => {
        window.languageManager = new LanguageManager();
        console.log('✅ LanguageManager initialized. Current language:', window.languageManager.getCurrentLanguage());
    }, 150); // 150ms delay ensures main.js finishes first
});

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}
