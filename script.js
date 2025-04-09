// script.js (Version avec quelques micro-ajustements et logs de débogage)

document.addEventListener('DOMContentLoaded', () => {

    const cardContainer = document.getElementById('cardContainer');
    const frontCard = document.getElementById('frontCard');
    const backCard = document.getElementById('backCard');
    const cardMoi = document.getElementById('cardMoi');
    const cardPassions = document.getElementById('cardPassions');
    const clickSound = document.getElementById('clickSound');

    let currentVisibleSubCard = null; // Variable pour suivre la sous-carte visible

    // --- Logique du Flip Initial ---
    frontCard.addEventListener('click', () => {
        if (!cardContainer.classList.contains('is-flipped')) {
            cardContainer.classList.add('is-flipped');
            if (clickSound) {
                clickSound.volume = 0.4;
                clickSound.play().catch(e => console.error("Erreur lecture audio:", e));
            }
        }
    });

    // --- Logique des Boutons sur la Carte "Back" ---
    document.getElementById('btnMoi').addEventListener('click', (e) => {
        console.log("Clic Bouton 'Moi'"); // Pour déboguer
        e.stopPropagation(); // TRÈS IMPORTANT: Empêche le clic de remonter
        showSubCard(cardMoi);
    });

    document.getElementById('btnPassions').addEventListener('click', (e) => {
        console.log("Clic Bouton 'Passions'"); // Pour déboguer
        e.stopPropagation(); // TRÈS IMPORTANT: Empêche le clic de remonter
        showSubCard(cardPassions);
    });

    // --- Fonctions pour Gérer l'Affichage des Sous-Cartes ---

    function showSubCard(cardToShow) {
        console.log(`Tentative d'affichage de: ${cardToShow.id}. Actuellement visible: ${currentVisibleSubCard ? currentVisibleSubCard.id : 'aucune'}`); // Debug

        // Ne rien faire si on clique sur le bouton de la carte déjà visible
        if (currentVisibleSubCard === cardToShow) {
            console.log("Carte déjà visible, on ne fait rien."); // Debug
            return;
        }

        // Si une autre sous-carte est visible, la cacher d'abord
        if (currentVisibleSubCard) {
             console.log(`Cache l'ancienne carte: ${currentVisibleSubCard.id}`); // Debug
            const cardToHide = currentVisibleSubCard; // Garde une référence
             currentVisibleSubCard = null; // On considère qu'on est en transition

            gsap.to(cardToHide, {
                opacity: 0,
                duration: 0.3, // Animation de disparition rapide
                onComplete: () => {
                     console.log(`Disparition de ${cardToHide.id} terminée.`); // Debug
                    cardToHide.style.display = 'none'; // Cacher complètement après animation
                    displayNewSubCard(cardToShow); // Afficher la nouvelle seulement APRES que l'ancienne soit cachée
                }
            });
        } else {
            // Si aucune n'est visible, afficher directement la nouvelle
             console.log("Aucune carte visible, on affiche directement la nouvelle."); // Debug
            displayNewSubCard(cardToShow);
        }
    }

    function displayNewSubCard(cardToShow) {
        console.log(`Affichage et animation de: ${cardToShow.id}`); // Debug
        currentVisibleSubCard = cardToShow; // Mettre à jour la carte visible
        cardToShow.style.display = 'flex'; // Rendre l'élément visible
        cardToShow.scrollTop = 0; // Remonter en haut si scrollable

        // Animation d'apparition avec GSAP
        gsap.fromTo(cardToShow,
            { opacity: 0, y: 20 }, // Départ: invisible et un peu bas
            { opacity: 1, y: 0, duration: 0.4, ease: 'power1.out' } // Arrivée: visible et à sa place
        );
    }

    // --- Fonction pour le Bouton Retour ---
    // Doit être attachée à window pour être accessible via onclick="" dans l'HTML
    window.showBack = function() {
         console.log(`Clic Bouton 'Retour'. Carte visible: ${currentVisibleSubCard ? currentVisibleSubCard.id : 'aucune'}`); // Debug
        if (currentVisibleSubCard) {
            const cardToHide = currentVisibleSubCard;
            currentVisibleSubCard = null; // Indiquer qu'aucune sous-carte n'est active

            gsap.to(cardToHide, {
                opacity: 0,
                y: 20, // Effet de sortie
                duration: 0.4,
                ease: 'power1.in',
                onComplete: () => {
                     console.log(`Retour: Disparition de ${cardToHide.id} terminée.`); // Debug
                    cardToHide.style.display = 'none'; // Cacher l'élément après animation
                }
            });
        }
    }

    // --- Préchargement (Optionnel mais utile) ---
    const profilePic = new Image();
    profilePic.src = 'https://raw.githubusercontent.com/soteo3d/QRcard/media/oui.JPG';
    if (clickSound) {
        clickSound.load();
    }

}); // Fin de l'écouteur DOMContentLoaded
