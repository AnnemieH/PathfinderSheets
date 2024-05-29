import { useEffect, useState } from "react"
import CharacterArchetypesOfBaseClass from "./CharacterArchetypesOfBaseClass";
import ClassSelector from "../../Classes/ClassSelector";
import findCharAttributeByID from "../Functions/attributes";
import { getModifier } from "../../Attributes/getModifier";
import HPCell from "./HPCell";
import LevelCell from "./LevelCell";


// PROPS
// character - the character in question
// charClass - the character class in question
// expand - a function to tell the parent to give more information on this class
// editMode - whether or not we're editing right now
// update(charClass) - a function to update the character class information in the database
export default function CharacterClassRow ( props )
{
    const [charClass, setCharClass] = useState ({});
    const [editing, setEditing] = useState(false);

    const [level, setLevel] = useState(0);
    const [hp, setHp] = useState(0);

    useEffect(() => {
        setCharClass(props.charClass);
    }, [props])

    // Whenever charClass changes, set hp and level based off them
    useEffect( () => {
        setLevel(charClass.level);
        setHp(charClass.hp);
    }, [charClass])

    // Validate hp and level whenever they change
    useEffect( () => {
        // Make sure we're in an editing space
        if ( editing )
        {
            // -1 is the flag for invalid values
            if ( hp == -1 )
            {
                document.getElementById(charClass.id.classID + "confirm").disabled = true;
            }
            else
            {
                document.getElementById(charClass.id.classID + "confirm").disabled = false;
            }
        }
    }, [hp, level])

    function filterArchetypes( arr  )
    {
        const filteredArr = arr.filter( elem => (
            charClass.archetypes.find( arche => arche.classID === elem.classID ) === undefined
        ));

        return [...filteredArr];
    }

    // Propagate changed values to database
    function updateClass()
    {
        const updateJSON = {};
        updateJSON.charClasses = [];

        for ( const arche of charClass.archetypes )
        {
            const classJSON = {};
            classJSON.charClass = arche;
            classJSON.level = level;
            classJSON.hp = hp;

            const idJSON = {};
            idJSON.classID = arche.classID;
            idJSON.characterID = props.character.raw.characterID;
            classJSON.id = idJSON;

            updateJSON.charClasses.push({...classJSON});
        }

        // Now deal with the class itself
        const classJSON = {};
        classJSON.charClass = charClass.charClass;
        classJSON.level = level;
        classJSON.hp = hp;

        const idJSON = {};
        idJSON.classID = charClass.id.classID;
        idJSON.characterID = props.character.raw.characterID;
        classJSON.id = idJSON;

        updateJSON.charClasses.push({...classJSON});

        props.update(updateJSON);
    }

    function deleteClass( event )
    {
        event.preventDefault();

        const updateJSON = {};
        updateJSON.charClasses = [];

        // Iterate through all character classes and flag archetypes of charClass for deletion
        for ( const arche of charClass.archetypes )
        {
            // To flag archetype for deletion, set its level to -1
            const classJSON = {};
            classJSON.charClass = arche;
            classJSON.level = -1;

            const idJSON = {};
            idJSON.classID = arche.classID;
            idJSON.characterID = props.character.raw.characterID;
            classJSON.id = idJSON;

            updateJSON.charClasses.push({...classJSON});
        }

        // Now flag charClass itself for deletion
        // To flag archetype for deletion, set its level to -1
        const classJSON = {};
        classJSON.charClass = charClass.charClass;
        classJSON.level = -1;

        const idJSON = {};
        idJSON.classID = charClass.id.classID;
        idJSON.characterID = props.character.raw.characterID;
        classJSON.id = idJSON;

        updateJSON.charClasses.push({...classJSON});

        props.update(updateJSON);
    }

    function addArchetype ( charClass )
    {
        // Update the database iff charClass is non-null
        if ( charClass.classID !== undefined )
        {
            const updateJSON = {};
            updateJSON.charClasses = [];

            const classJSON = {};
            classJSON.charClass = charClass;

            // Make the level of the archetype match that of the base class
            classJSON.level = (props.character.raw.charClasses.find( c => ( c.id.classID == charClass.archetype.classID))).level;

            const idJSON = {};
            idJSON.classID = charClass.classID;
            idJSON.characterID = props.character.raw.characterID;
            classJSON.id = idJSON;

            updateJSON.charClasses.push({...classJSON});

            props.update(updateJSON);
        }
    }

    function deleteArchetype ( charClass )
    {
        // Update the database iff charClass is non-null
        if ( charClass.classID !== undefined )
            {
                const updateJSON = {};
                updateJSON.charClasses = [];
    
                const classJSON = {};
                classJSON.charClass = charClass.charClass;
    
                // Make the level of the archetype -1 to flag it for deletion
                classJSON.level = -1;
    
                const idJSON = {};
                idJSON.classID = charClass.classID;
                idJSON.characterID = character.raw.characterID;
                classJSON.id = idJSON;
    
                updateJSON.charClasses.push({...classJSON});
    
                props.update(updateJSON);
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

    // Finalise information and propagate it upwards
    function confirm ( event )
    {
        event.preventDefault();

        setEditing(false);

        updateClass();
    }

    function editClass ( event )
    {
        event.preventDefault();

        setEditing(true);
    }

    function editButton()
    {
        if ( props.editMode === false )
        {
            return (<></>);
        }
        else
        {
            if ( editing )
            {
                return (
                    <button type="button" onClick={confirm} id={charClass.id.classID + "confirm"}>Confirm</button>
                );
            }
            else
            {
                return (
                    <button type="button" onClick={editClass}>Edit</button>
                );
            }
        }
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
                <span onClick={deleteClass} className="cancel">X</span>
            );
        }
    }

    function levelChanged ( newLevel )
    {
        setLevel ( newLevel );
    }

    function hpChanged ( newHP )
    {
        setHp ( newHP );
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
                    <CharacterArchetypesOfBaseClass archetypes={charClass.archetypes} cancel={deleteArchetype} editMode={props.editMode}/>
                </td>
                <td>
                    <LevelCell charClass={charClass} character={props.character} editing={editing} update={levelChanged}/>
                </td>
                <td>
                    <HPCell charClass={charClass} character={props.character} level={level} editing={editing} update={hpChanged}/>
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