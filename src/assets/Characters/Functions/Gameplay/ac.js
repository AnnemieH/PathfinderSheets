import { getModifier } from "../../../Attributes/getModifier";
import findCharAttributeByID from "./attributes";

export default function getAC ( character )
{
    let dex = parseInt(getModifier(findCharAttributeByID(character, 2)));

    return 10 + dex;
}