export function getRecipeCardTemplateCSS() {
    return `
        body {
            background-image: url("wood-texture.jpg");
            background-size: cover;
            display: flex;
            flex-wrap: wrap;
            gap: 0.5em;
        }

        .tags-class {
            display: flex;
            flex-wrap: wrap;
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
            float: right;
            margin-left: auto;
            margin-right: 70px;
            margin-top: 30px;
            width: fit-content;
            border-radius: 8px;
        }

        .steps-list li {
            text-align: left;
            margin-top: 20px;
        }
        
        /* Favorite Button */
        .favorite-btn {
            position: absolute;
            top: 5px;
            right: 50px;
            background-color:rgb(211, 211, 211);
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
            background-color: transparent;
            width: 500px;
            height: 300px;
            border-radius: 16px;
            overflow: hidden;
            perspective: 1000px;
            margin: 1rem;
        }
          
        /*For positioning front and back side of card */
        
        .flip-card-inner {
            position: relative;
            width: 100%;
            height: 100%;
            transition: 1s;
            transform-style: preserve-3d;
            border-radius: 16px;
        }
        
        /* Recipe card will flip when hovered over with mouse */
        
        /*.flip-card:hover .flip-card-inner {
            transform: rotateY(180deg);
        }*/

        .flip-card.flipped .flip-card-inner {
            transform: rotateY(180deg);
        }
          
          
        .flip-card-front, .flip-card-back {
            position: absolute;
            width: 100%;
            height: 100%;
            -webkit-backface-visibility: hidden; /* Safari */
            backface-visibility: hidden;
            border-radius: 16px;
            background-image: url("old-paper-texture.avif");
            background-size: 500px 300px;
        }
          
          
        .flip-card-front {
            background-color: bisque;
            padding: 20px;
        }
        
        
        .flip-card-back {
            background-color:aqua;
            transform: rotateY(180deg);
            
            overflow: scroll;
        }
    `;
}