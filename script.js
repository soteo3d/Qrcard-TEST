// script.js

document.addEventListener('DOMContentLoaded', () => {

    // === NOUVEAU : Récupération des éléments de sélection ===
    const genderSelection = document.getElementById('genderSelection');
    const btnFemme = document.getElementById('btnFemme');
    const btnHomme = document.getElementById('btnHomme');
    const resultHomme = document.getElementById('resultHomme');
    const hommeSound = document.getElementById('hommeSound');
    const cardContainer = document.getElementById('cardContainer'); // On a déjà cette ligne

    // === Récupération des éléments existants ===
    const frontCard = document.getElementById('frontCard');
    const backCard = document.getElementById('backCard');
    const cardMoi = document.getElementById('cardMoi');
    const cardPassions = document.getElementById('cardPassions');
    const clickSound = document.getElementById('clickSound'); // Son du flip

    let currentVisibleSubCard = null;

    // === NOUVEAU : Logique de sélection initiale ===

    // Au chargement, s'assurer que seul genderSelection est visible
    // (Normalement géré par CSS display:none, mais double sécurité)
    if (genderSelection) genderSelection.style.display = 'flex';
    if (cardContainer) cardContainer.style.display = 'none';
    if (resultHomme) resultHomme.style.display = 'none';
    if (cardMoi) cardMoi.style.display = 'none';
    if (cardPassions) cardPassions.style.display = 'none';


    // Clic sur "Une Femme"
    if (btnFemme) {
        btnFemme.addEventListener('click', () => {
            console.log("Choix : Femme");
            // Cacher la sélection
            gsap.to(genderSelection, { opacity: 0, duration: 0.4, onComplete: () => {
                genderSelection.style.display = 'none';
                // Afficher le conteneur principal de la carte
                if (cardContainer) {
                    cardContainer.style.display = 'block'; // Ou 'flex' si besoin pour son layout interne
                    // Animer l'apparition du conteneur
                    gsap.fromTo(cardContainer, {opacity: 0, scale: 0.9}, {opacity: 1, scale: 1, duration: 0.5, delay: 0.1});
                }
            }});
        });
    }

    // Clic sur "Un Homme"
    if (btnHomme) {
        btnHomme.addEventListener('click', () => {
            console.log("Choix : Homme");
            // Jouer le son homme
            if (hommeSound) {
                hommeSound.volume = 0.6;
                hommeSound.play().catch(e => console.error("Erreur lecture son homme:", e));
            }
            // Cacher la sélection
            gsap.to(genderSelection, { opacity: 0, duration: 0.4, onComplete: () => {
                genderSelection.style.display = 'none';
                // Afficher le résultat homme
                if (resultHomme) {
                    resultHomme.style.display = 'flex';
                    // Animer l'apparition
                     gsap.fromTo(resultHomme, {opacity: 0, scale: 0.9}, {opacity: 1, scale: 1, duration: 0.5, delay: 0.1});
                }
            }});
        });
    }

    // === FIN Logique de sélection initiale ===


    // === Logique existante pour le flip et les sous-cartes ===
    // (Cette partie reste inchangée, elle ne sera active que si
    // le cardContainer devient visible après avoir cliqué "Femme")

    // Logique du Flip Initial
    if (frontCard) {
        frontCard.addEventListener('click', () => {
           // ... (code existant pour ajouter .is-flipped) ...
           if (clickSound) { /* ... */ }
        });
    }

    // Logique des Boutons sur la Carte "Back"
    const btnMoiElement = document.getElementById('btnMoi');
    if (btnMoiElement) {
        btnMoiElement.addEventListener('click', (e) => {
            // ... (code existant avec stopPropagation et showSubCard) ...
        });
    }
    const btnPassionsElement = document.getElementById('btnPassions');
     if (btnPassionsElement) {
        btnPassionsElement.addEventListener('click', (e) => {
             // ... (code existant avec stopPropagation et showSubCard) ...
        });
    }


    // Fonctions pour Gérer l'Affichage des Sous-Cartes (showSubCard, displayNewSubCard)
    // (Ces fonctions restent inchangées)
    function showSubCard(cardToShow) { /* ... code existant ... */ }
    function displayNewSubCard(cardToShow) { /* ... code existant ... */ }


    // Fonction pour le Bouton Retour (Reste globale)
    window.showBack = function() { /* ... code existant ... */ }


    // Préchargement (Ajouter les nouveaux éléments)
    const profilePic = new Image();
    profilePic.src = 'https://raw.githubusercontent.com/soteo3d/QRcard/media/oui.JPG';
    // NOUVEAU: Précharger l'image homme
    const hommePic = new Image();
    hommePic.src = 'https://raw.githubusercontent.com/soteo3d/QRcard/media/homme.png';

    if (clickSound) clickSound.load();
    if (hommeSound) hommeSound.load(); // NOUVEAU: Précharger son homme

}); // Fin de l'écouteur DOMContentLoaded
