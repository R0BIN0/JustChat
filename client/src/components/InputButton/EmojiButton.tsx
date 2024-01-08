import EmojiPicker, { Categories, EmojiStyle } from "emoji-picker-react";
import "./EmojiButton.css";
import { useEmojiButton } from "./EmojiButton.logic";
import { memo } from "react";
import EmojiIcon from "../../icons/EmojiIcon/EmojiIcon";

const categories = [
  {
    name: "Suggestions",
    category: Categories.SUGGESTED,
  },
  {
    name: "Personnes",
    category: Categories.SMILEYS_PEOPLE,
  },

  {
    name: "Animaux",
    category: Categories.ANIMALS_NATURE,
  },

  {
    name: "Nourritures",
    category: Categories.FOOD_DRINK,
  },

  {
    name: "Lieux",
    category: Categories.TRAVEL_PLACES,
  },

  {
    name: "Activités",
    category: Categories.ACTIVITIES,
  },

  {
    name: "Objets",
    category: Categories.OBJECTS,
  },

  {
    name: "Symboles",
    category: Categories.SYMBOLS,
  },
];

const EmojiButton = memo((props: { setEmoji: (emoji: string) => void }) => {
  const logic = useEmojiButton(props);

  return (
    <>
      <div className="emoji-button-container">
        {logic.dialogIsOpen && (
          <div className="emoji-button-picker-container">
            <EmojiPicker
              width={280}
              onEmojiClick={logic.onEmojiClick}
              skinTonesDisabled
              emojiStyle={EmojiStyle.TWITTER}
              searchPlaceHolder={"Rechercher"}
              categories={categories}
            />
          </div>
        )}
        <button onClick={logic.handleDialog}>{<EmojiIcon />}</button>
      </div>
    </>
  );
});

export default EmojiButton;
