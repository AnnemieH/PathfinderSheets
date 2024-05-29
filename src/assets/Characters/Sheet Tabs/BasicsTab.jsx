import { useState, useEffect } from "react";
import AttributeDisplayTable from "../../Attributes/AttributeDisplayTable";
import CharacterClassTable from "../Classes/CharacterClassTable";

export default function BasicsTab( props )
{
    const [currentCharacter, setCurrentCharacter] = useState({});

    // Set up states when props changes
    useEffect ( () => {
        setCurrentCharacter(props.character);
    }, [props]);

    // Given an ID, find the attribute of currentCharacter with that ID
    function findAttributeByID ( id )
    {
        // Make sure character exists first
        if ( currentCharacter.raw.attributes !== undefined )
        {
            for ( const attribute of currentCharacter.raw.attributes )
            {
                if ( attribute.id.attributeID == id )
                {
                    return attribute;
                }
            }
        }

        // Not found anything? Return null
        return null;
    }

    // Propagate any updates upwards after converting to a string.
    function update ( inputJSON )
    {
        props.update(JSON.stringify(inputJSON));
    }

    if ( currentCharacter.raw !== undefined )
    {
        return (
            <span>
                <h1>{currentCharacter.raw.name}</h1>
                <table id="basicsTable">
                    <tbody>
                        <tr>
                            <td colSpan={2}>
                                <table id="topBasicsTable">
                                    <thead></thead>
                                    <tbody>
                                        <tr className="attributeRow">
                                            <td>
                                                <AttributeDisplayTable attribute={findAttributeByID(1)}  update={update}/>
                                            </td>
                                            <td>
                                                <AttributeDisplayTable attribute={findAttributeByID(2)} update={update}/>
                                            </td>
                                            <td>
                                                <AttributeDisplayTable attribute={findAttributeByID(3)} update={update}/>
                                            </td>
                                            <td>
                                                <AttributeDisplayTable attribute={findAttributeByID(4)} update={update}/>
                                            </td>
                                            <td>
                                                <AttributeDisplayTable attribute={findAttributeByID(5)} update={update}/>
                                            </td>
                                            <td>
                                                <AttributeDisplayTable attribute={findAttributeByID(6)} update={update}/>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <table id="leftBasicsTable">
                                    <tbody>
                                        <tr>
                                            <td>Race: </td>
                                            <td>{currentCharacter.raw.race.raceName}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                            <td>
                                <table id="rightBasicsTable">
                                    <thead>
                                        <tr><td><h2>Classes</h2></td></tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <CharacterClassTable character={currentCharacter} editMode={props.editMode} update={update}/>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </span>
        )
    }
    else
    {
        return <></>
    }
}