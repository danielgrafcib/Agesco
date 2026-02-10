/**
 * Multilingual Translation System for GROUP AGECOSCO
 * Manages French and English translations across the website
 */

const translations = {
    fr: {
        // Navigation
        nav: {
            home: "Accueil",
            about: "À Propos",
            aboutDropdown: {
                quality: "Qualité et Politique",
                team: "Notre Équipe",
                health: "Santé et Sécurité",
                conditions: "Conditions Générales du Service"
            },
            branches: "Branches",
            services: "Services",
            servicesDropdown: {
                tally: "Inspections et Supervisions de Pointage",
                surveys: "Expertises",
                claims: "Gestion des Réclamations P&I",
                loss: "Plans de Prévention des Pertes",
                risk: "Gestion des Risques",
                fruit: "Fruits et Denrées Périssables",
                agrifood: "Secteur Agroalimentaire"
            },
            languages: "Langues",
            contact: "Contactez-Nous"
        },

        // Topbar
        topbar: {
            address: "Rue du CYRUS Ablogame N°1,Lomé, TOGO",
            hours: "Lun-Vend:9H-18H/ Sam:9H-12H"
        },

        // Hero Section
        hero: {
            title0: "25 ANS D'EXPÉRIENCE DANS LES INSPECTIONS DE CARGAISONS",
            description0: "Fournissant des inspections marines et de cargaisons en Afrique de l'Ouest via notre bureau du TOGO.",
            title1: "INSPECTIONS INDÉPENDANTES",
            description1: "Nous faisons la différence lors des chargements et déchargements avec notre équipe expérimentée.",
            title2: "SERVICES RAPIDES ET FIABLES ASSURANCE ET EXPERTISES DE DOMMAGES CARGAISONS",
            description2: "Fournissant des services d'expertise en assurance et dommages rapides et orientés solutions localement et mondialement depuis plus de 25 ans avec nos experts en cargaisons et assurances expérimentés.",
            title3: "SOLUTIONS COMPLÈTES POUR LES EXPERTISES MARITIMES",
            description3: "Expertise de tirant d'eau, on/off – soute et plus encore.",
            btnCheck: "Vérifiez",
            btnQuote: "Devis",
            btnReadMore: "En Savoir Plus",
            btnMoreInfo: "Plus d'Info"
        },

        // Main Services Section
        services: {
            heading: "Nos Services Principaux",
            service1: {
                title: "Inspections et Supervisions de Pointage",
                description: "Consiste à vérifier et enregistrer avec précision les quantités de marchandises chargées ou déchargées d'un navire."
            },
            service2: {
                title: "Inspection avant Chargement et Déchargement",
                description: "Garantir l'intégrité et la conformité des marchandises avant, pendant et après le transport maritime."
            },
            service3: {
                title: "Interventions de gestion de crise",
                description: "Répondre aux accidents, incendies, pollutions marines ou autres incidents critiques affectant les opérations maritimes."
            }
        },

        // About Section
        about: {
            heading: "À Propos",
            title: "À Propos",
            paragraph1: "AGECOSCO est une entreprise maritime d'inspection internationale, fondée en 1999 et accréditée ISO 17020 par l'Agence d'accréditation du Togo. En tant que seul organisme national d'accréditation reconnu par le gouvernement togolais, nous sommes fiers de notre affiliation avec le ministère des Affaires étrangères.",
            paragraph2: "Notre équipe, composée d'ingénieurs et d'experts qualifiés, met à votre disposition plus de 10 ans d'expérience dans le domaine de l'inspection maritime. Nous nous engageons à garantir la conformité des organismes d'évaluation aux normes nationales et internationales.",
            paragraph3: "Grâce à notre large gamme de services, y compris l'inspection, le contrôle et la surveillance, GROUP AGECOSCO se positionne comme votre partenaire de confiance pour toutes vos opérations maritimes.",
            stats: {
                clients: "Clients satisfaits",
                projects: "Projets effectués"
            },
            btnMore: "Plus d'infos"
        },

        // Services Overview
        servicesOverview: {
            heading: "Services",
            service1: {
                title: "Inspections and Supervisions",
                description: "Charter-Party disputes (including bunker disputes, disputes with Stevedores, towage companies etc).",
                btnReadMore: "En Savoir Plus"
            },
            service2: {
                title: "Average Adjustments",
                description: "Transport recommendations and supervisions of project cargoes, including road surveys",
                btnReadMore: "En Savoir Plus"
            },
            service3: {
                title: "Crisis Control Interventions",
                description: "We are dedicated professionals with expertise in emergency response and crisis management for maritime operations.",
                btnReadMore: "En Savoir Plus"
            },
            service4: {
                title: "Risk Management",
                description: "We specialize in managing and preventing pests that have the potential to infest vessels, cargo, port facilities, and offshore platforms.",
                btnReadMore: "En Savoir Plus"
            }
        },

        // Realizations Section
        realizations: {
            heading: "Réalisations",
            title: "Inspection de navires de commerce",
            description: "GROUP AGECOSCO a réalisé l'inspection de navires de commerce pour garantir leur conformité aux normes de sécurité et environnementales internationales, permettant ainsi une opération sécurisée dans les eaux togolaises.",
            features: {
                trusted: "De confiance",
                quality: "Haute qualité",
                smart: "Intelligent",
                hours: "24/7 Hours"
            },
            items: {
                inspections: "Inspections and Supervisions",
                prevention: "Prevention Plans",
                risk: "Risk Management",
                surveys: "Surveys"
            }
        },

        // Portfolio/Projects
        projects: {
            heading: "Nos Travaux",
            filter: {
                all: "Tous",
                completed: "Travaux Terminés",
                ongoing: "Travaux en Cours"
            },
            project1: {
                title: "Transport Claims Consultants Network",
                category: "Gestion des Risques",
                description: "Transport Claims Consultants Network cvba was created in 1998, to act as independent P & I consultants"
            },
            project2: {
                title: "We are dedicated professionals with expertise",
                category: "Plans de Prévention des Pertes",
                description: "We are dedicated professionals with expertise in investigating and assessing insurance claims to ascertain the scope of coverage and the suitable settlement amount."
            },
            project3: {
                title: "organises supervision of large calamities and casualties",
                category: "Contrôle de Crise / Gestion des Sinistres",
                description: "Organises supervision of large calamities and casualties with expert crisis management and emergency response"
            },
            project4: {
                title: "Fruits and perishables are integral to global trade",
                category: "Fruits & Denrées Périssables",
                description: "With numerous countries engaged in the import and export of a diverse array of fresh produce and perishable goods. Here's an overview of our involvement in this sector"
            },
            project5: {
                title: "We specialize in managing and preventing pests",
                category: "Enquêtes Judiciaires",
                description: "We specialize in managing and preventing pests that have the potential to infest vessels, cargo, port facilities, and offshore platforms."
            },
            project6: {
                title: "Agecosco performs numerous types of cargo surveys",
                category: "Expertises",
                description: "Surveys with a special focus on project cargoes and comprehensive maritime inspection services"
            }
        },

        // Accreditations
        accreditations: {
            heading: "Accréditations",
            cert1: "Certification Gafta Togo",
            cert2: "Certification iso 9001 Togo",
            cert3: "Certification Gafta Benin"
        },

        // Team Section
        team: {
            heading: "Notre Équipe",
            ceo: "PDG",
            manager: "Manager",
            projectManager: "Chef Projet"
        },

        // Testimonials
        testimonials: {
            heading: "Témoignages",
            testimonial1: {
                quote: "Le professionnalisme et la rigueur des inspecteurs d'AGECOSCO ont considérablement amélioré notre efficacité opérationnelle. Nous leur faisons confiance pour garantir notre conformité aux réglementations.",
                position: "Manager"
            },
            testimonial2: {
                quote: "Group Agecosco nous a constamment fourni des services d'inspection fiable qui respectent les normes internationales. L'expertise de leur équipe rend nos opérations maritimes beaucoup plus fluides.",
                position: "PDG"
            },
            testimonial3: {
                quote: "Nous avons établi un partenariat avec Group Agecosco depuis plusieurs années, et leur engagement envers la qualité et la conformité est inégalé.",
                position: "Chef Projet"
            }
        },

        // Footer
        footer: {
            address: "Adresse",
            addressFull: "Rue du CYRUS-Ablogame N°1,Villa N°140-Zone Portuaire Lomé-TOGO",
            phone: "Tél:(228) 90-05-74-66 Cél:(228) 98-24-64-83",
            servicesTitle: "Services",
            menuTitle: "Menu",
            newsletterTitle: "Bulletin d'information",
            newsletterDescription: "Suivez-nous à travers nos annonces.",
            newsletterPlaceholder: "Votre email",
            newsletterBtn: "Inscrire",
            copyright: "Agecosco 2025 Tous Droits Réservés",
            designedBy: "Ce Site Web est créé par",
            department: "un département d'"
        },

        // Common Buttons
        buttons: {
            readMore: "En Savoir Plus",
            learnMore: "Plus d'Info",
            getQuote: "Obtenir un Devis",
            contactUs: "Contactez-Nous",
            viewAll: "Voir Tout",
            backToTop: "Retour en Haut"
        },

        // Accessibility
        accessibility: {
            skipToContent: "Passer au contenu principal",
            loading: "Chargement...",
            openMenu: "Ouvrir le menu",
            closeMenu: "Fermer le menu",
            previousSlide: "Diapositive précédente",
            nextSlide: "Diapositive suivante",
            pauseCarousel: "Mettre en pause le carrousel",
            playCarousel: "Lire le carrousel"
        },

        tally: {
            header: "Inspections et Supervisions de Pointage",
            section: "Services",
            subheader: "Inspections & Supervisions de Pointage",
            overview: "Services Professionnels d'Inspection de Pointage",
            overview_desc: "Services complets de pointage de cargaison, supervision de chargement et de déchargement avec expertise."
        }
    },

    en: {
        // Navigation
        nav: {
            home: "Home",
            about: "About",
            aboutDropdown: {
                quality: "Quality and Policy",
                team: "Our Team",
                health: "Health and Safety",
                conditions: "General Conditions of the Service"
            },
            branches: "Branches",
            services: "Services",
            servicesDropdown: {
                tally: "Tally Inspections and Supervisions",
                surveys: "Surveys",
                claims: "P&I Claims Handling",
                loss: "Loss Prevention Plans",
                risk: "Risk and Management",
                fruit: "Fruit and Perishables",
                agrifood: "Agrifood Sector"
            },
            languages: "Languages",
            contact: "Contact Us"
        },

        // Topbar
        topbar: {
            address: "Rue du CYRUS Ablogame N°1, Lomé, TOGO",
            hours: "Mon-Fri: 9AM-6PM / Sat: 9AM-12PM"
        },

        // Hero Section
        hero: {
            title0: "25 YEARS OF EXPERIENCE IN CARGO INSPECTIONS",
            description0: "Providing marine and cargo inspections at West Africa via our TOGO office.",
            title1: "INDEPENDENT INSPECTIONS",
            description1: "We make a difference at loading and discharges with our experienced team.",
            title2: "FAST & RELIABLE SERVICES INSURANCE & CARGO DAMAGE SURVEYS",
            description2: "Providing fast and solution-oriented insurance & damage expertise services locally and globally for over 25 years with our experienced cargo and insurance experts.",
            title3: "COMPLETE SOLUTIONS FOR MARINE SURVEYS",
            description3: "Draft survey, on/off – bunker and more.",
            btnCheck: "Check",
            btnQuote: "Quotation",
            btnReadMore: "Read More",
            btnMoreInfo: "More Info"
        },

        // Main Services Section
        services: {
            heading: "Our Main Services",
            service1: {
                title: "Tally Inspections and Supervisions",
                description: "Consists of verifying and accurately recording the quantities of goods loaded or unloaded from a vessel."
            },
            service2: {
                title: "Pre-Loading and Unloading Inspection",
                description: "Ensure the integrity and compliance of goods before, during and after maritime transport."
            },
            service3: {
                title: "Crisis Management Interventions",
                description: "Respond to accidents, fires, marine pollution or other critical incidents affecting maritime operations."
            }
        },

        // About Section
        about: {
            heading: "About Us",
            title: "About Us",
            paragraph1: "AGECOSCO is an international marine inspection company, founded in 1999 and accredited to ISO 17020 by the Togo Accreditation Agency. As the only national accreditation body recognized by the Togolese government, we are proud of our affiliation with the Ministry of Foreign Affairs.",
            paragraph2: "Our team of qualified engineers and experts has over 25 years of combined experience in marine inspection. We are committed to ensuring that our assessment bodies comply with national and international standards, providing unparalleled expertise in maritime operations.",
            paragraph3: "Thanks to our wide range of services, including inspection, control and surveillance, GROUP AGECOSCO is your trusted partner for all your maritime operations across West Africa.",
            stats: {
                clients: "Happy Clients",
                projects: "Projects Done"
            },
            btnMore: "Explore More"
        },

        // Services Overview
        servicesOverview: {
            heading: "Services",
            service1: {
                title: "Inspections and Supervisions",
                description: "Charter-Party disputes (including bunker disputes, disputes with Stevedores, towage companies etc).",
                btnReadMore: "Read More"
            },
            service2: {
                title: "Average Adjustments",
                description: "Transport recommendations and supervisions of project cargoes, including road surveys",
                btnReadMore: "Read More"
            },
            service3: {
                title: "Crisis Control Interventions",
                description: "We are dedicated professionals with expertise in emergency response and crisis management for maritime operations.",
                btnReadMore: "Read More"
            },
            service4: {
                title: "Risk Management",
                description: "We specialize in managing and preventing pests that have the potential to infest vessels, cargo, port facilities, and offshore platforms.",
                btnReadMore: "Read More"
            }
        },

        // Realizations Section
        realizations: {
            heading: "Realizations",
            title: "Commercial Vessel Inspection",
            description: "GROUP AGECOSCO has carried out the inspection of commercial vessels to ensure their compliance with international safety and environmental standards, thus enabling safe operation in Togolese waters.",
            features: {
                trusted: "Trusted",
                quality: "Quality",
                smart: "Smart",
                hours: "24/7 Hours"
            },
            items: {
                inspections: "Inspections and Supervisions",
                prevention: "Prevention Plans",
                risk: "Risk Management",
                surveys: "Surveys"
            }
        },

        // Portfolio/Projects
        projects: {
            heading: "Our Works",
            filter: {
                all: "All",
                completed: "Completed Works",
                ongoing: "Ongoing Works"
            },
            project1: {
                title: "Transport Claims Consultants Network",
                category: "Risk Management",
                description: "Transport Claims Consultants Network cvba was created in 1998, to act as independent P & I consultants"
            },
            project2: {
                title: "We are dedicated professionals with expertise",
                category: "Loss Prevention Plans",
                description: "We are dedicated professionals with expertise in investigating and assessing insurance claims to ascertain the scope of coverage and the suitable settlement amount."
            },
            project3: {
                title: "organises supervision of large calamities and casualties",
                category: "Crisis Control / Casualty Management",
                description: "Organises supervision of large calamities and casualties with expert crisis management and emergency response"
            },
            project4: {
                title: "Fruits and perishables are integral to global trade",
                category: "Fruits & Perishables",
                description: "With numerous countries engaged in the import and export of a diverse array of fresh produce and perishable goods. Here's an overview of our involvement in this sector"
            },
            project5: {
                title: "We specialize in managing and preventing pests",
                category: "Forensic Investigations",
                description: "We specialize in managing and preventing pests that have the potential to infest vessels, cargo, port facilities, and offshore platforms."
            },
            project6: {
                title: "Agecosco performs numerous types of cargo surveys",
                category: "Surveys",
                description: "Surveys with a special focus on project cargoes and comprehensive maritime inspection services"
            }
        },

        // Accreditations
        accreditations: {
            heading: "Accreditations",
            cert1: "Gafta Certification Togo",
            cert2: "ISO 9001 Certification Togo",
            cert3: "Gafta Certification Benin"
        },

        // Team Section
        team: {
            heading: "Our Team",
            ceo: "CEO",
            manager: "Manager",
            projectManager: "Project Manager"
        },

        // Testimonials
        testimonials: {
            heading: "Testimonials",
            testimonial1: {
                quote: "The professionalism and rigor of AGECOSCO inspectors have considerably improved our operational efficiency. We trust them to ensure our compliance with regulations.",
                position: "Manager"
            },
            testimonial2: {
                quote: "Group Agecosco has consistently provided us with reliable inspection services that meet international standards. Their team's expertise makes our maritime operations much smoother.",
                position: "CEO"
            },
            testimonial3: {
                quote: "We have established a partnership with Group Agecosco for several years, and their commitment to quality and compliance is unmatched.",
                position: "Project Manager"
            }
        },

        // Footer
        footer: {
            address: "Address",
            addressFull: "Rue du CYRUS-Ablogame N°1, Villa N°140-Zone Portuaire Lomé-TOGO",
            phone: "Tel: (228) 90-05-74-66 Cell: (228) 98-24-64-83",
            servicesTitle: "Services",
            menuTitle: "Quick Links",
            newsletterTitle: "Newsletter",
            newsletterDescription: "Stay updated with our latest news.",
            newsletterPlaceholder: "Your email",
            newsletterBtn: "Subscribe",
            copyright: "Agecosco 2025 All Rights Reserved",
            designedBy: "This Website is created by",
            department: "a department of"
        },

        // Common Buttons
        buttons: {
            readMore: "Read More",
            learnMore: "Learn More",
            getQuote: "Get Quote",
            contactUs: "Contact Us",
            viewAll: "View All",
            backToTop: "Back to Top"
        },

        // Accessibility
        accessibility: {
            skipToContent: "Skip to main content",
            loading: "Loading...",
            openMenu: "Open menu",
            closeMenu: "Close menu",
            previousSlide: "Previous slide",
            nextSlide: "Next slide",
            pauseCarousel: "Pause carousel",
            playCarousel: "Play carousel"
        },

        tally: {
            header: "Tally Inspections and Supervisions",
            section: "Services",
            subheader: "Tally Inspections & Supervisions",
            overview: "Professional Tally Inspection Services",
            overview_desc: "Comprehensive cargo tally, loading supervision, and discharge inspection services with expert oversight."
        }
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = translations;
}
