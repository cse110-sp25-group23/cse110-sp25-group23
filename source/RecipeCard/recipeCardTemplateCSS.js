export function getRecipeCardTemplateCSS() {
    return `
        
        .tags-wrapper {
            position: absolute;
            bottom: 5px;
            left: 5px;
            max-width: 20em;
            overflow: hidden;
            white-space: nowrap;
        }
        
        .tags-class {
            display: inline-flex;
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
        
        @keyframes scroll-left {
            0% {
                transform: translateX(0%);
            }
            100% {
                transform: translateX(-50%);
            }
        }
        
        .scroll-animate {
            animation: scroll-left 15s linear infinite;
        }

        .recipe-image{
            float: right;
            max-height: 200px;
            max-width: 200px;
            height: 100%;
            width: 100%;
            margin-top: 1.5em;
            margin-right: 0em;
            margin-bottom: 1em;
            margin-left: 1em;
            width: fit-content;
            border-radius: 8px;
        }
                
        .flip-card:fullscreen .recipe-name {
            font-size: 5em;
        }

        .flip-card:fullscreen .recipe-author {
            font-size: 2em;
        }

        .flip-card:fullscreen .steps-list {
            font-size: 1.5em;
        }

        .flip-card:fullscreen .steps-title {
            font-size: 2em;
        }

        .flip-card:fullscreen .recipe-image {
            max-height: 20em;
            height: 100%;
            max-width: 20em;
            width: 100%;
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
            cursor: pointer;
        }

        .favorite-btn:hover {
            transform: scale(1.05);
        }

        .favorite-btn.favorited {
            background-color:rgb(249, 43, 112); 
            color: white;
        }

        /*Fullscreen toggle button*/
        .toggle {
            position: absolute;
            bottom: 1em;  
            right: 1em;   
            cursor: pointer;
        }

        /*Card flip animation */

        .flip-card {
            font-family: pacifo regular;
            background-color: transparent;
            width: 100%;
            max-width: 32em;
            height: 20em;
            border-radius: 16px;
            perspective: 1000px;
            margin: 1em;
            overflow: visible;
            min-width: 440px;
        }

        * Specific styling for when the card is in fullscreen mode*/

        .flip-card:fullscreen {
            background-color: #ba3226;
            margin: 2rem;
        }
          
        /*For positioning front and back side of card */
        
        .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: transform 1s, border 0.3s ease 1s, box-shadow 0.3s ease 1s;
            transform-style: preserve-3d;
        }
        
        /* Recipe card will flip when hovered over with mouse */
        
        .flip-card:hover {
            transform: scale(1.02);
            box-shadow: 0 0 12px rgba(255, 255, 255, 0.5); /* optional glow effect */
            z-index: 1; /* optional: brings hovered card to front if overlapping */
        }
            
        /* Card flip animation information */

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
            box-sizing: border-box;
        }
        
        .flip-card-front {
            padding: 2em;
            overflow: hidden;
            text-align: left;
        }
        
        
        .flip-card-back {
            transform: rotateY(180deg);
            text-align: center;
            overflow: scroll;
            padding: 1em;
        }

        p + .ingredients-scroll {
            margin-top: -0.7em; 
        }

        .ingredients-scroll {
            max-height: 5.2rem; /* adjust as needed */
            max-width: 14rem;
            overflow-y: scroll;
            padding-right: 0.5em; /* optional: avoids cutting off scrollbar */
            border: 3px ridge #ba3226;
        }

        .ingredients-scroll::-webkit-scrollbar {
            width: 6px;
        }

        .ingredients-scroll::-webkit-scrollbar-thumb {
            background-color: #ccc;
            border-radius: 4px;
        }

        .delete-btn {
            border: none;
            padding: 6px 10px;
            border-radius: 6px;
            margin-left: 20px;
            cursor: pointer;
        }

        .edit-btn {
            border: none;
            margin-left: 4px;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
        }
    `;
}