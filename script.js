// Attend que le contenu HTML soit chargé
document.addEventListener('DOMContentLoaded', () => {

    // Récupération des éléments
    const cardContainer = document.getElementById('cardContainer');
    const frontCard = document.getElementById('frontCard');
    const backCard = document.getElementById('backCard'); // Peut être utile si on veut interagir avec plus tard
    const cardMoi = document.getElementById('cardMoi');
    const cardPassions = document.getElementById('cardPassions');
    const clickSound = document.getElementById('clickSound');

    let currentVisibleSubCard = null; // Variable pour suivre la sous-carte visible

    // --- Logique du Flip Initial ---
    // On écoute le clic sur la carte de devant
    frontCard.addEventListener('click', () => {
        // On ne retourne que si la carte n'est PAS déjà retournée
        if (!cardContainer.classList.contains('is-flipped')) {
            cardContainer.classList.add('is-flipped');
            // Jouer le son (optionnel)
            if (clickSound) {
                clickSound.volume = 0.4; // Baisser un peu le volume ?
                clickSound.play().catch(e => console.error("Erreur lecture audio:", e)); // Gestion erreur simple
            }
        }
    });

    // --- Logique des Boutons sur la Carte "Back" ---
    document.getElementById('btnMoi').addEventListener('click', (e) => {
        e.stopPropagation(); // Empêche le clic de se propager au conteneur parent
        showSubCard(cardMoi);
    });

    document.getElementById('btnPassions').addEventListener('click', (e) => {
        e.stopPropagation();
        showSubCard(cardPassions);
    });

    // --- Fonctions pour Gérer l'Affichage des Sous-Cartes ---

    // Fonction pour MONTRER une sous-carte spécifique
    function showSubCard(cardToShow) {
        // Si une autre sous-carte est déjà visible, on la cache d'abord
        if (currentVisibleSubCard && currentVisibleSubCard !== cardToShow) {
            gsap.to(currentVisibleSubCard, {
                opacity: 0,
                duration: 0.3,
                onComplete: () => {
                    currentVisibleSubCard.style.display = 'none'; // Cacher après fondu
                    currentVisibleSubCard = null; // Réinitialiser le tracker
                    displayNewSubCard(cardToShow); // Afficher la nouvelle carte
                }
            });
        } else if (!currentVisibleSubCard) {
            // Si aucune sous-carte n'est visible, on affiche directement la nouvelle
            displayNewSubCard(cardToShow);
        }
        // Si on clique sur le bouton de la carte déjà affichée, ne rien faire.
    }

    // Fonction interne pour afficher et animer la nouvelle sous-carte
    function displayNewSubCard(cardToShow) {
        currentVisibleSubCard = cardToShow; // Mettre à jour le tracker
        cardToShow.style.display = 'flex'; // Rendre visible (pour l'animation)

        // Animation d'apparition avec GSAP
        gsap.fromTo(cardToShow,
            { opacity: 0, y: 20 }, // État initial (invisible, un peu bas)
            { opacity: 1, y: 0, duration: 0.4, ease: 'power1.out' } // État final (visible, position normale)
        );
    }

    // --- Fonction pour le Bouton Retour ---
    // NOTE: Cette fonction doit être globale car elle est appelée par `onclick` dans l'HTML
    window.showBack = function() {
        if (currentVisibleSubCard) {
            gsap.to(currentVisibleSubCard, {
                opacity: 0,
                y: 20, // Effet de sortie vers le bas
                duration: 0.4,
                ease: 'power1.in',
                onComplete: () => {
                    currentVisibleSubCard.style.display = 'none'; // Cacher après animation
                    currentVisibleSubCard = null; // Réinitialiser le tracker
                }
            });
        }
        // On ne retourne pas automatiquement la carte principale, l'utilisateur reste sur le verso.
    }

    // --- Préchargement (Optionnel mais recommandé) ---
    // Pour que l'image et le son soient prêts plus vite
    const profilePic = new Image();
    profilePic.src = 'https://raw.githubusercontent.com/soteo3d/QRcard/media/oui.JPG';

    if (clickSound) {
        clickSound.load(); // Demande au navigateur de charger le son
    }

}); // Fin de l'écouteur DOMContentLoaded
