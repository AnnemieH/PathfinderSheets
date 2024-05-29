import { useEffect, useState } from "react"
import findCharAttributeByID from "../Functions/attributes";
import { getModifier } from "../../Attributes/getModifier";
import { babAtLevel, fortAtLevel, refAtLevel, willAtLevel } from "../../Classes/Functions/babsaves";

export default function CharacterClassInfo ( props )
{
    const [character, setCharacter] = useState({});
    const [charClass, setCharClass] = useState({});

    useEffect(() => {
        setCharacter(props.character);
        setCharClass(props.charClass);

    }, [props])

    if ( charClass.charClass !== undefined )
    {
        return (
            <tr>
                <td colSpan={2}>
                    <table>
                        <thead>
                            <tr>
                                <td></td>
                                <td>Hit die</td>
                                <td>Skills</td>
                                <td>BAB</td>
                                <td>Fort</td>
                                <td>Ref</td>
                                <td>Will</td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td></td>
                                <td>D{charClass.charClass.hitDie}</td>
                                <td>{(charClass.charClass.skillRanks + getModifier(findCharAttributeByID(character, 4))) * charClass.level}</td>
                                <td>{babAtLevel( charClass, charClass.level )}</td>
                                <td>{fortAtLevel( charClass, charClass.level )}</td>
                                <td>{refAtLevel( charClass, charClass.level )}</td>
                                <td>{willAtLevel( charClass, charClass.level )}</td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        )
    }
    else
    {
        return (
            <></>
        )
    }
}