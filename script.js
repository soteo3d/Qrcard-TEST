// Attend que le contenu HTML soit chargé
document.addEventListener('DOMContentLoaded', () => {

    // === Récupération des éléments ===
    const genderSelection = document.getElementById('genderSelection');
    const btnFemme = document.getElementById('btnFemme');
    const btnHomme = document.getElementById('btnHomme');
    const resultHomme = document.getElementById('resultHomme');
    const hommeSound = document.getElementById('hommeSound');
    const cardContainer = document.getElementById('cardContainer');
    const frontCard = document.getElementById('frontCard');
    const backCard = document.getElementById('backCard'); // Garder référence si besoin futur
    const cardMoi = document.getElementById('cardMoi');
    const cardPassions = document.getElementById('cardPassions');
    const clickSound = document.getElementById('clickSound'); // Son du flip

    let currentVisibleSubCard = null; // Pour suivre la sous-carte visible

    // === Configuration initiale (sécurité, même si géré par CSS) ===
    if (genderSelection) genderSelection.style.display = 'flex';
    if (cardContainer) cardContainer.style.display = 'none';
    if (resultHomme) resultHomme.style.display = 'none';
    if (cardMoi) cardMoi.style.display = 'none';
    if (cardPassions) cardPassions.style.display = 'none';

    // === Logique de sélection initiale ===

    // Clic sur "Une Femme"
    if (btnFemme) {
        btnFemme.addEventListener('click', () => {
            // Cacher la sélection avec animation
            gsap.to(genderSelection, { opacity: 0, duration: 0.4, onComplete: () => {
                genderSelection.style.display = 'none';
                // Afficher le conteneur principal de la carte
                if (cardContainer) {
                    cardContainer.style.display = 'block'; // Rendre visible dans le layout
                    // Animer son apparition
                    gsap.fromTo(cardContainer,
                        {opacity: 0, scale: 0.95}, // Départ
                        {opacity: 1, scale: 1, duration: 0.5, delay: 0.1, ease: 'power1.out'} // Arrivée
                    );
                }
            }});
        });
    }

    // Clic sur "Un Homme"
    if (btnHomme) {
        btnHomme.addEventListener('click', () => {
            // Jouer le son homme
            if (hommeSound) {
                hommeSound.volume = 0.6; // Ajuster volume si besoin
                hommeSound.play().catch(e => console.error("Erreur lecture son homme:", e));
            }
            // Cacher la sélection avec animation
            gsap.to(genderSelection, { opacity: 0, duration: 0.4, onComplete: () => {
                genderSelection.style.display = 'none';
                // Afficher le résultat homme
                if (resultHomme) {
                    resultHomme.style.display = 'flex'; // Rendre visible
                    // Animer son apparition
                     gsap.fromTo(resultHomme,
                        {opacity: 0, scale: 0.95}, // Départ
                        {opacity: 1, scale: 1, duration: 0.5, delay: 0.1, ease: 'power1.out'} // Arrivée
                    );
                }
            }});
        });
    }

    // === Logique du Flip et des Sous-Cartes ===

    // Dans script.js, à l'intérieur de DOMContentLoaded

// Flip au clic sur la carte avant
if (frontCard) {
    frontCard.addEventListener('click', () => {
        console.log("Clic sur la carte avant détecté."); // Log 1

        // Vérifier les conditions avant de retourner
        let alreadyFlipped = cardContainer.classList.contains('is-flipped');
        let subCardVisible = currentVisibleSubCard !== null;
        console.log("Déjà retournée ?", alreadyFlipped); // Log 2
        console.log("Sous-carte visible ?", subCardVisible); // Log 3

        if (!alreadyFlipped && !subCardVisible) {
            console.log("Conditions remplies : Ajout de la classe .is-flipped"); // Log 4
            cardContainer.classList.add('is-flipped');

            // Jouer le son du flip (optionnel)
            if (clickSound) {
                clickSound.volume = 0.4;
                clickSound.play().catch(e => console.error("Erreur lecture audio flip:", e));
            }
        } else {
            console.log("Conditions NON remplies pour retourner."); // Log 5
        }
    });
}

    // Boutons sur la Carte "Back" ("Moi" et "Passions")
    const btnMoiElement = document.getElementById('btnMoi');
    if (btnMoiElement) {
        btnMoiElement.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêche le clic de déclencher autre chose
            showSubCard(cardMoi);
        });
    }
    const btnPassionsElement = document.getElementById('btnPassions');
     if (btnPassionsElement) {
        btnPassionsElement.addEventListener('click', (e) => {
            e.stopPropagation();
            showSubCard(cardPassions);
        });
    }

    // Fonction pour MONTRER une sous-carte spécifique
    function showSubCard(cardToShow) {
        // Ne rien faire si on clique sur le bouton de la carte déjà visible
        if (currentVisibleSubCard === cardToShow) {
            return;
        }
        // Si une autre sous-carte est visible, la cacher d'abord
        if (currentVisibleSubCard) {
            const cardToHide = currentVisibleSubCard;
            currentVisibleSubCard = null; // Marquer comme en transition

            gsap.to(cardToHide, {
                opacity: 0,
                duration: 0.3, // Disparition rapide
                onComplete: () => {
                    cardToHide.style.display = 'none';
                    displayNewSubCard(cardToShow); // Afficher la nouvelle après
                }
            });
        } else {
            // Si aucune n'est visible, afficher directement la nouvelle
            displayNewSubCard(cardToShow);
        }
    }

    // Fonction interne pour afficher et animer la nouvelle sous-carte
    function displayNewSubCard(cardToShow) {
        currentVisibleSubCard = cardToShow; // Mettre à jour la carte visible
        cardToShow.style.display = 'flex'; // Rendre l'élément visible
        cardToShow.scrollTop = 0; // Remonter en haut si scrollable

        // Animation d'apparition avec GSAP
        gsap.fromTo(cardToShow,
            { opacity: 0, y: 20 }, // Départ: invisible et un peu bas
            { opacity: 1, y: 0, duration: 0.4, ease: 'power1.out' } // Arrivée: visible et à sa place
        );
    }

    // Fonction pour le Bouton Retour (Doit être globale via window)
    window.showBack = function() {
        if (currentVisibleSubCard) {
            const cardToHide = currentVisibleSubCard;
            currentVisibleSubCard = null; // Indiquer qu'aucune sous-carte n'est active

            gsap.to(cardToHide, {
                opacity: 0,
                y: 20, // Effet de sortie vers le bas
                duration: 0.4,
                ease: 'power1.in',
                onComplete: () => {
                    cardToHide.style.display = 'none'; // Cacher l'élément après animation
                }
            });
        }
    }

    // === Préchargement des médias ===
    // Images
    const profilePic = new Image();
    profilePic.src = 'https://raw.githubusercontent.com/soteo3d/QRcard/media/oui.JPG'; // Vérifie ce chemin si besoin
    const hommePic = new Image();
    // Vérifie le chemin exact de l'image homme dans TON dépôt Qrcard-TEST
    hommePic.src = 'https://raw.githubusercontent.com/soteo3d/Qrcard-TEST/media/homme.png'; // ou homme.JPG ?

    // Sons
    if (clickSound) clickSound.load();
    if (hommeSound) hommeSound.load();

}); // Fin de l'écouteur DOMContentLoaded
