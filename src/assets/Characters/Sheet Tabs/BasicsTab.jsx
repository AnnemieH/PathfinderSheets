import { useState, useEffect } from "react";
import AttributeDisplayTable from "../../Attributes/AttributeDisplayTable";

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
        if ( currentCharacter.attributes !== undefined )
        {
            for ( const attribute of currentCharacter.attributes )
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

    if ( currentCharacter.name !== undefined )
    {
        return (
            <span>
                <h1>{currentCharacter.name}</h1>
                <table>
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
                        <tr>
                            <td>Race: </td>
                            <td>{currentCharacter.race.raceName}</td>
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