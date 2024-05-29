import { useEffect, useState } from "react"
import CharacterArchetypesOfBaseClass from "./CharacterArchetypesOfBaseClass";
import ClassSelector from "../../Classes/ClassSelector";


// PROPS
// charClass - the character class in question
// expand - a function to tell the parent to give more information on this class
// editMode - whether or not we're editing right now
// update(charClass) - a function to update the character class information in the database
export default function CharacterClassRow ( props )
{
    const [charClass, setCharClass] = useState ({});
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        setCharClass(props.charClass);
    }, [props])

    function filterArchetypes( arr  )
    {
        const filteredArr = arr.filter( elem => (
            charClass.archetypes.find( arche => arche.classID === elem.classID ) === undefined
        ));

        return [...filteredArr];
    }

    function addArchetype ( charClass )
    {
        // Update the database iff charClass is non-null
        if ( charClass.classID !== undefined )
        {
            props.update( wrapArchetype( charClass ) )
        }
    }

    function addArchetypeSelector()
    {
        if ( props.editMode === false )
        {
            return (<></>);
        }
        else if ( editing === true )
        {
            return (
                <ClassSelector seedClass={props.charClass.charClass} filter={filterArchetypes} classSelected={addArchetype}/>
            )
        }
    }

    function editClass ( event )
    {
        event.preventDefault();

        setEditing(!editing);
    }

    function editButton()
    {
        if ( props.editMode === false )
        {
            return (<></>);
        }
        else
        {
            return (
                <button type="button" onClick={editClass}>Edit</button>
            );
        }
    }

    function cancelClass( event )
    {
        event.preventDefault();

        props.update( charClass );
    }

    function cancelButton()
    {
        if ( props.editMode === false )
        {
            return (<></>);
        }
        else
        {
            return (
                <span onClick={cancelClass} className="cancel">X</span>
            );
        }
    }

    // Wrap arche so it looks like a base class
    function wrapArchetype ( arche )
    {
        const wrappedArche = {};
        wrappedArche.charClass = arche;
        wrappedArche.archetypes = [];

        return wrappedArche;
    }

    function cancelArchetype( arche )
    {
        props.update ( wrapArchetype (arche) );
    }

    if ( charClass.charClass !== undefined )
    {
        return (
            <tr>
                <td>
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    {charClass.charClass.className}
                                </td>
                                <td>
                                    {cancelButton()}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
                <td>
                    {addArchetypeSelector()}
                    <CharacterArchetypesOfBaseClass archetypes={charClass.archetypes} cancel={cancelArchetype} editMode={props.editMode}/>
                </td>
                <td>
                    {charClass.level}
                </td>
                <td>
                    {editButton()}
                </td>
            </tr>
        )
    }
    else
    {
        return <></>
    }
}