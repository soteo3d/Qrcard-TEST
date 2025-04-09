// Attend que le DOM (la structure HTML) soit entièrement chargé et analysé
document.addEventListener('DOMContentLoaded', () => {

    // === Récupération des éléments HTML par leur ID ===
    const genderSelection = document.getElementById('genderSelection'); // Div de sélection H/F
    const btnFemme = document.getElementById('btnFemme');               // Bouton "Femme"
    const btnHomme = document.getElementById('btnHomme');               // Bouton "Homme"
    const resultHomme = document.getElementById('resultHomme');         // Div résultat si Homme
    const hommeSound = document.getElementById('hommeSound');           // Audio si Homme
    const cardContainer = document.getElementById('cardContainer');     // Conteneur principal pour le flip
    const frontCard = document.getElementById('frontCard');             // Carte Recto
    const backCard = document.getElementById('backCard');               // Carte Verso
    const cardMoi = document.getElementById('cardMoi');                 // Sous-carte "Moi"
    const cardPassions = document.getElementById('cardPassions');       // Sous-carte "Passions"
    const clickSound = document.getElementById('clickSound');           // Son du flip principal

    // Variable pour suivre quelle sous-carte est actuellement visible (null si aucune)
    let currentVisibleSubCard = null;

    // === Configuration de l'état initial au chargement ===
    // Assure que seule la sélection de genre est visible au début
    // (Normalement géré par CSS `display: none`, mais c'est une sécurité)
    if (genderSelection) genderSelection.style.display = 'flex';
    if (cardContainer) cardContainer.style.display = 'none';
    if (resultHomme) resultHomme.style.display = 'none';
    if (cardMoi) cardMoi.style.display = 'none';
    if (cardPassions) cardPassions.style.display = 'none';

    // === Logique de la sélection initiale (Homme/Femme) ===

    // Gestionnaire d'événement pour le clic sur "Une Femme"
    if (btnFemme) {
        btnFemme.addEventListener('click', () => {
            // Cacher la sélection avec une animation de fondu (GSAP)
            gsap.to(genderSelection, {
                opacity: 0,
                duration: 0.4,
                onComplete: () => { // Une fois la sélection cachée...
                    genderSelection.style.display = 'none'; // Cacher complètement
                    // Afficher le conteneur principal de la carte
                    if (cardContainer) {
                        cardContainer.style.display = 'block'; // Rendre visible dans le layout
                        // Animer son apparition (fondu + léger zoom arrière)
                        gsap.fromTo(cardContainer,
                            { opacity: 0, scale: 0.95 }, // État de départ
                            { // État d'arrivée
                                opacity: 1,
                                scale: 1,
                                duration: 0.5,
                                delay: 0.1, // Petit délai
                                ease: 'power1.out',
                                // Correction CRUCIALE: Nettoyer le transform inline après l'animation
                                // pour éviter les conflits avec le flip CSS.
                                onComplete: () => {
                                    cardContainer.style.transform = '';
                                }
                            }
                        );
                    }
                }
            });
        });
    }

    // Gestionnaire d'événement pour le clic sur "Un Homme"
    if (btnHomme) {
        btnHomme.addEventListener('click', () => {
            // Jouer le son spécifique "Homme"
            if (hommeSound) {
                hommeSound.volume = 0.6; // Ajuster volume si besoin
                // Utiliser .catch pour éviter les erreurs si la lecture échoue
                hommeSound.play().catch(e => console.error("Erreur lecture son homme:", e));
            }
            // Cacher la sélection avec animation
            gsap.to(genderSelection, {
                opacity: 0,
                duration: 0.4,
                onComplete: () => { // Une fois la sélection cachée...
                    genderSelection.style.display = 'none';
                    // Afficher la carte résultat "Homme"
                    if (resultHomme) {
                        resultHomme.style.display = 'flex'; // Rendre visible
                        // Animer son apparition
                         gsap.fromTo(resultHomme,
                            { opacity: 0, scale: 0.95 }, // Départ
                            { opacity: 1, scale: 1, duration: 0.5, delay: 0.1, ease: 'power1.out' } // Arrivée
                        );
                    }
                }
            });
        });
    }

    // === Logique du Flip de la Carte Principale ===

    // Gestionnaire d'événement pour le clic sur la carte Recto
    if (frontCard) {
        frontCard.addEventListener('click', () => {
            // Vérifier si la carte n'est pas déjà retournée ET si aucune sous-carte n'est visible
            let alreadyFlipped = cardContainer.classList.contains('is-flipped');
            let subCardVisible = currentVisibleSubCard !== null;

            if (!alreadyFlipped && !subCardVisible) {
                // Ajouter la classe qui déclenche la rotation CSS
                cardContainer.classList.add('is-flipped');
                if (navigator.vibrate) { // Vérifier si le navigateur supporte l'API Vibration
                navigator.vibrate(80); // Vibration courte (80 millisecondes) - ajuste si besoin
            }
                // Jouer le son du flip
                if (clickSound) {
                    clickSound.volume = 0.4; // Ajuster volume
                    clickSound.play().catch(e => console.error("Erreur lecture audio flip:", e));
                }
            }
        });
    }

    // === Logique des Boutons de la Carte Verso ===

    // Bouton "Moi"
    const btnMoiElement = document.getElementById('btnMoi');
    if (btnMoiElement) {
        btnMoiElement.addEventListener('click', (e) => {
            e.stopPropagation(); // Empêche le clic de remonter (et potentiellement retourner la carte)
            showSubCard(cardMoi); // Afficher la sous-carte "Moi"
        });
    }
    // Bouton "Passions"
    const btnPassionsElement = document.getElementById('btnPassions');
     if (btnPassionsElement) {
        btnPassionsElement.addEventListener('click', (e) => {
            e.stopPropagation();
            showSubCard(cardPassions); // Afficher la sous-carte "Passions"
        });
    }

    // === Fonctions d'Affichage/Masquage des Sous-Cartes ===

    /**
     * Affiche une sous-carte spécifique en cachant d'abord celle qui est éventuellement visible.
     * @param {HTMLElement} cardToShow - L'élément de la sous-carte à afficher.
     */
    function showSubCard(cardToShow) {
        // Si on clique sur le bouton de la carte déjà visible, ne rien faire
        if (currentVisibleSubCard === cardToShow) {
            return;
        }
        // Si une autre sous-carte est visible, l'animer pour la cacher
        if (currentVisibleSubCard) {
            const cardToHide = currentVisibleSubCard;
            currentVisibleSubCard = null; // Indiquer qu'on est en transition

            gsap.to(cardToHide, {
                opacity: 0,
                duration: 0.3, // Animation rapide
                onComplete: () => {
                    cardToHide.style.display = 'none'; // Cacher complètement
                    displayNewSubCard(cardToShow); // Afficher la nouvelle carte après
                }
            });
        } else {
            // Si aucune sous-carte n'est visible, afficher directement la nouvelle
            displayNewSubCard(cardToShow);
        }
    }

    /**
     * Rend visible et anime l'apparition d'une nouvelle sous-carte.
     * @param {HTMLElement} cardToShow - L'élément de la sous-carte à afficher.
     */
    function displayNewSubCard(cardToShow) {
        currentVisibleSubCard = cardToShow; // Mettre à jour quelle carte est visible
        cardToShow.style.display = 'flex'; // Rendre visible dans le layout
        cardToShow.scrollTop = 0; // Remonter en haut au cas où elle soit scrollable

        // Animer l'apparition (opacité + léger déplacement vertical)
        gsap.fromTo(cardToShow,
            { opacity: 0, y: 20 }, // État de départ
            { opacity: 1, y: 0, duration: 0.4, ease: 'power1.out' } // État d'arrivée
        );
        const elementsToAnimate = cardToShow.querySelectorAll('h1, p, .btn');

            // Animer ces éléments avec un décalage (stagger)
        gsap.from(elementsToAnimate, {
            opacity: 0,        // Commence invisible
            y: 15,             // Commence légèrement plus bas
            duration: 0.35,    // Durée de l'animation de chaque élément
            ease: 'power1.out',
            stagger: 0.08,     // Délai entre l'animation de chaque élément (en secondes)
            delay: 0.2         // Délai avant de commencer cette animation de texte (après l'apparition de la carte)
        });

        
    }

    // === Fonction pour le Bouton Retour des Sous-Cartes ===
    // Doit être attachée à l'objet `window` pour être appelable par `onclick="showBack()"` dans l'HTML
    window.showBack = function() {
        if (currentVisibleSubCard) { // S'il y a bien une sous-carte visible
            const cardToHide = currentVisibleSubCard;
            currentVisibleSubCard = null; // Plus de sous-carte active

            // Animer la disparition
            gsap.to(cardToHide, {
                opacity: 0,
                y: 20, // Léger mouvement vers le bas
                duration: 0.4,
                ease: 'power1.in',
                onComplete: () => {
                    cardToHide.style.display = 'none'; // Cacher complètement après l'animation
                }
            });
        }
    }

    // === Préchargement des médias (améliore la réactivité au premier usage) ===
    // Images
    const profilePic = new Image();
    // CHEMIN PROD : Vérifie ce chemin si l'image est aussi dans Qrcard-TEST
    profilePic.src = 'https://raw.githubusercontent.com/soteo3d/QRcard/media/oui.JPG';
    const hommePic = new Image();
    // CHEMIN PROD : Vérifie ce chemin
    hommePic.src = 'https://raw.githubusercontent.com/soteo3d/Qrcard-TEST/media/homme.png'; // ou homme.JPG?

    // Sons
    if (clickSound) clickSound.load();
    if (hommeSound) hommeSound.load();

}); // Fin de l'écouteur DOMContentLoaded
