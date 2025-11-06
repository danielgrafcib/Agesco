# Système Multilingue GROUP AGECOSCO
# Multilingual System for GROUP AGECOSCO Website

## 📋 Vue d'ensemble / Overview

Ce système permet de basculer facilement entre le français et l'anglais sur tout le site web GROUP AGECOSCO sans rechargement de page.

This system enables seamless switching between French and English across the GROUP AGECOSCO website without page reload.

---

## 🚀 Fonctionnalités / Features

### Français
- ✅ **Traduction en temps réel** : Changement de langue instantané sans rechargement
- ✅ **Persistance** : La langue choisie est sauvegardée dans localStorage
- ✅ **Accessibilité** : Support complet des lecteurs d'écran (ARIA)
- ✅ **Animation fluide** : Transition douce lors du changement de langue
- ✅ **Indicateur visuel** : Icône de confirmation pour la langue active
- ✅ **Navigation au clavier** : Support complet Entrée/Espace
- ✅ **SEO friendly** : Attribut `lang` mis à jour dynamiquement

### English
- ✅ **Real-time translation**: Instant language change without reload
- ✅ **Persistence**: Chosen language saved in localStorage
- ✅ **Accessibility**: Full screen reader support (ARIA)
- ✅ **Smooth animation**: Smooth transition when changing language
- ✅ **Visual indicator**: Check icon for active language
- ✅ **Keyboard navigation**: Full Enter/Space support
- ✅ **SEO friendly**: `lang` attribute updated dynamically

---

## 📁 Structure des fichiers / File Structure

```
Agecosco/
├── js/
│   ├── translations.js          # Fichiers de traduction FR/EN
│   ├── language-manager.js      # Gestionnaire de langue principal
│   └── main.js                  # Scripts existants
├── css/
│   └── style.css                # Styles (avec styles du sélecteur de langue)
└── index.html                   # Page principale avec sélecteur intégré
```

---

## 🔧 Installation / Setup

### 1. Fichiers requis / Required Files

Assurez-vous que ces fichiers sont inclus dans votre HTML **avant** le `</head>` :

Make sure these files are included in your HTML **before** `</head>`:

```html
<!-- Language System -->
<script src="js/translations.js"></script>
<!-- Note: load language scripts after the Bootstrap bundle. See implementation guide. -->
```

### 2. Sélecteur de langue dans la navbar / Language Selector in Navbar

```html
<div class="nav-item dropdown">
    <a href="#" class="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown"
        aria-expanded="false" aria-haspopup="true" aria-label="Language selection menu">
        <i class="fas fa-globe me-2"></i>Languages
    </a>
    <div class="dropdown-menu rounded-0 rounded-bottom m-0" aria-label="Language options">
        <a href="#" class="dropdown-item" data-lang="fr" lang="fr">
            <i class="fas fa-check me-2 text-primary" style="opacity: 0;"></i>
            <span>Français</span>
        </a>
        <a href="#" class="dropdown-item" data-lang="en" lang="en">
            <i class="fas fa-check me-2 text-primary" style="opacity: 0;"></i>
            <span>English</span>
        </a>
    </div>
</div>
```

---

## 💡 Utilisation / Usage

### Changement de langue / Changing Language

**Méthode 1 - Interface utilisateur / User Interface:**
1. Cliquez sur "Languages" dans la navbar
2. Sélectionnez "Français" ou "English"

**Méthode 2 - Via JavaScript:**
```javascript
// Changer en français
window.languageManager.setLanguage('fr');

// Changer en anglais
window.languageManager.setLanguage('en');

// Obtenir la langue actuelle
const currentLang = window.languageManager.getCurrentLanguage();
console.log(currentLang); // 'fr' ou 'en'
```

### Obtenir une traduction / Get a Translation

```javascript
// Accéder à une traduction spécifique
const homeText = window.languageManager.t('nav.home');
console.log(homeText); // "Accueil" (si français) ou "Home" (si anglais)

// Traduction imbriquée
const quality = window.languageManager.t('nav.aboutDropdown.quality');
```

---

## 🎨 Personnalisation / Customization

### Ajouter de nouvelles traductions / Adding New Translations

Modifiez `js/translations.js` :

Edit `js/translations.js`:

```javascript
const translations = {
    fr: {
        // Ajoutez vos nouvelles clés ici
        newSection: {
            title: "Nouveau Titre",
            description: "Description en français"
        }
    },
    en: {
        // Add your new keys here
        newSection: {
            title: "New Title",
            description: "English description"
        }
    }
};
```

### Personnaliser les styles / Customize Styles

Les styles du sélecteur sont dans `css/style.css` :

Selector styles are in `css/style.css`:

```css
/* Language Selector Styles */
.dropdown-item[data-lang] {
    /* Vos styles personnalisés */
}

.dropdown-item[data-lang].active {
    /* Style de l'élément actif */
}
```

---

## 🔍 Éléments traduits / Translated Elements

### Sections traduites automatiquement / Auto-Translated Sections:

1. **Navigation** (navbar et menus déroulants)
2. **Topbar** (heures d'ouverture)
3. **Hero/Carousel** (titres, descriptions, boutons)
4. **Services principaux** (3 services Facts)
5. **À propos** (paragraphes, statistiques, boutons)
6. **Aperçu des services** (4 services avec liens)
7. **Réalisations** (titres, descriptions, caractéristiques)
8. **Projets/Portfolio** (filtres, titres de projets)
9. **Accréditations** (titres de certification)
10. **Équipe** (postes/rôles)
11. **Témoignages** (citations, positions)
12. **Footer** (titres de sections, newsletter)

---

## ⚡ Performance

- **Pas de rechargement de page** : Changement instantané
- **Léger** : ~1030 lignes de JavaScript au total
- **Stockage local** : Langue mémorisée pour les visites futures
- **Optimisé** : Traductions chargées une seule fois

---

## ♿ Accessibilité / Accessibility

- ✅ Support ARIA complet (`aria-current`, `aria-label`, `role`)
- ✅ Navigation au clavier (Entrée/Espace)
- ✅ Annonces aux lecteurs d'écran
- ✅ Attribut `lang` mis à jour sur `<html>`
- ✅ Focus management
- ✅ Indicateurs visuels et auditifs

---

## 🌐 Support des navigateurs / Browser Support

- ✅ Chrome/Edge (dernières versions)
- ✅ Firefox (dernières versions)
- ✅ Safari (dernières versions)
- ✅ Mobile (iOS Safari, Chrome Mobile)
- ⚠️ IE11 (support limité - polyfills requis)

---

## 🐛 Dépannage / Troubleshooting

### La langue ne change pas / Language doesn't change

**Vérifiez / Check:**
1. Les scripts sont chargés dans le bon ordre
2. Pas d'erreurs JavaScript dans la console
3. Les attributs `data-lang` sont présents sur les liens

### localStorage ne fonctionne pas

**Solution:**
- Vérifiez que les cookies/storage sont activés
- Mode navigation privée peut bloquer localStorage
- Utilisez HTTPS en production

### Traductions manquantes / Missing translations

**Solution:**
1. Vérifiez `js/translations.js` pour les clés manquantes
2. Utilisez `window.languageManager.t('key')` pour tester
3. Consultez la console pour les erreurs

---

## 📝 Exemple de déploiement / Deployment Example

### Pour toutes les pages / For All Pages:

Ajoutez ces lignes dans **chaque** fichier HTML :

Add these lines to **every** HTML file:

```html
<!-- Avant </head> / Before </head> -->
<script src="js/translations.js"></script>
<script src="js/language-manager.js"></script>

<!-- Dans la navbar / In navbar -->
<div class="nav-item dropdown">
    <!-- ... code du sélecteur de langue ... -->
</div>
```

---

## 📄 Licence / License

Ce système multilingue fait partie du site web GROUP AGECOSCO.

This multilingual system is part of the GROUP AGECOSCO website.

---

## 👨‍💻 Support

Pour toute question ou problème :

For any questions or issues:

- 📧 Email: agecosco@gmail.com
- 📞 Tel: (228) 90-05-74-66
- 📱 Cell: (228) 98-24-64-83

---

## 🎯 Prochaines étapes / Next Steps

1. ✅ Système de base implémenté
2. 🔄 Appliquer à toutes les pages HTML
3. 🔄 Tester sur tous les navigateurs
4. 🔄 Ajouter plus de traductions si nécessaire
5. 🔄 Optimiser les performances

---

**Version:** 1.0.0  
**Dernière mise à jour / Last Updated:** 2025-10-28  
**Auteur / Author:** GROUP AGECOSCO Web Development Team
