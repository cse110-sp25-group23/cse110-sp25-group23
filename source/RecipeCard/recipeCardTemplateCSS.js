export function getRecipeCardTemplateCSS() {
    return `
        .tags-class {
            display:flex;
            position: absolute;
            bottom: 1px;
            gap: 8px;
            align-items: center;
        }

        .tag {
            background-color: #eee;
            color: #333;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 0.75rem;
            box-shadow: 1px 1px 2px rgba(0,0,0,0.1);
        }


        .recipe-image{
            position: absolute;
            right: 30px;
            top: 55px;
            width: fit-content;
            border-radius: 8px;
        }

        .steps-list li {
            text-align: left;
            margin-top: 0.5rem;
        }
        
        /* Favorite Button */
        .favorite-btn {
            position: absolute;
            top: 5px;
            right: 10px;
            background-color:rgb(173, 173, 173);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 28px;
            color: white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            align-items: center;
            justify-content: center;
        }

        .favorite-btn:hover {
            transform: scale(1.05);
        }

        .favorite-btn.favorited {
            background-color:rgb(249, 43, 112); 
            color: white;
        }


        /*Card flip animation */

        .flip-card {
            font-family: inter;
            background-color: transparent;
            width: 500px;
            height: 260px;
            border-radius: 16px;
            overflow: visible;
            perspective: 1000px;
            margin: 1rem;
            will-change: transform;
            margin-bottom: 50px;
        }

        .flip-card:fullscreen {
            background-color: pink;
            padding: 20px; 
        }

        .toggle {
            position: absolute;
            bottom: 10px;
            right: 10px;
        }
          
        /*For positioning front and back side of card */
        
        .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 1s, border 0.3s ease 1s, box-shadow 0.3s ease 1s;
            transform-style: preserve-3d;
            border-radius: 16px;
            transform-origin: center center;
        }
        
        /* Recipe card will flip when hovered over with mouse */
        
        .flip-card:hover {
            transform: scale(1.02);
            box-shadow: 0 0 12px rgba(255, 255, 255, 0.5); /* optional glow effect */
            z-index: 1; /* optional: brings hovered card to front if overlapping */
        }

        .flip-card.flipped .flip-card-inner {
            transform: rotateY(180deg);
        }
          
          
        .flip-card-front, .flip-card-back {
            position: absolute;
            border: 2px solid black;
            width: 100%;
            height: 100%;
            -webkit-backface-visibility: hidden; /* Safari */
            backface-visibility: hidden;
            border-radius: 16px;
            background-color: #ffffff;
            padding: 20px;
        }
        
        .flip-card-back {
            transform: rotateY(180deg);
            text-align: center;
            overflow: scroll;
        }

        
        .ingredients-class {
            max-height: 6rem; /* adjust as needed */
            max-width: 12rem;
            overflow-y: scroll;
            padding-right: 0.5em; /* optional: avoids cutting off scrollbar */
            border: 3px ridge #ba3226;
        }

        .ingredients-class::-webkit-scrollbar {
            width: 6px;
        }

        .ingredients-class::-webkit-scrollbar-thumb {
            background-color: #ccc;
            border-radius: 4px;
        }

        .delete-btn {
            border: none;
            padding: 6px 10px;
            border-radius: 6px;
            margin-left: 20px;

        }

        .edit-btn {
            border: none;
            margin-left: 4px;
            padding: 6px 12px;
            border-radius: 6px;
        }
    `;
}