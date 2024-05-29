import React, { useEffect, useState } from "react"
import CharacterClassRow from "./CharacterClassRow";
import CharacterClassInfo from "./CharacterClassInfo";
import NewCharacterClass from "./NewCharacterClass";
import CharacterClassToAdd from "./CharacterClassToAdd";
import ExpandTableRow from "../../Generic/ExpandTableRow";

// PROPS
// editMode - boolean value recording whether or not we're in edit mode
// update( updateJSON ) - a function to update the current character according to updateJSON
export default function CharacterClassTable ( props )
{
    const [character, setCharacter] = useState([]);
    const [expansionJSON, setExpansionJSON] = useState({});
    const [characterClassesToAdd, setCharacterClassesToAdd] = useState([]);

    useEffect ( () => {
        setCharacter({...props.character});
    }, [props.character])

    // Set up expansionJSON so that all classIDs are false
    useEffect(() => {
        if ( character.raw !== undefined )
        {
            for ( let charClass of character.raw.charClasses )
            {
                expansionJSON[charClass.id.classID] = false;
            }
        }
    }, [character])

    function expandInfo ( classID )
    {
        let newJSON = {...expansionJSON};
        newJSON[ classID ] = !expansionJSON[ classID ];

        setExpansionJSON(newJSON);
    }

    function isExpanded ( classID )
    {
        if ( expansionJSON[classID] == "true" )
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    function addClass ( characterClass )
    {
        // Make sure characterClass exists and is not a duplicate before adding it
        if ( characterClass.classID !== undefined && characterClassesToAdd.find(x => x.classID == characterClass.classID) === undefined)
        {
            setCharacterClassesToAdd([...characterClassesToAdd.concat ( [characterClass] )]);
        }
    }

    // Take in an array of 1 base class + archetypes and convert it into an update JSON before propagating it upwards
    function postClass ( classes, level )
    {
        let updateArray = [];
        for ( const charClass of classes )
        {
            let classJSON = {};
            classJSON.charClass = charClass;
            classJSON.level = level;

            let idJSON = {};
            idJSON.classID = charClass.classID;
            idJSON.characterID = character.raw.characterID;
            classJSON.id = idJSON;
            
            updateArray.push(classJSON);
        }

        let updateJSON = {};
        updateJSON.charClasses = updateArray;

        props.update(updateJSON);

        // CLEAN UP
        // Remove the class we've just added from those we need to add
        setCharacterClassesToAdd( characterClassesToAdd.filter( charClass => classes.find( addedClass => addedClass.classID == charClass.classID ) === undefined ) );

    }

    function updateClass ( charClass )
    {
        // If charClass is already present in character, delete it
        // Otherwise add it
        if ( character.raw.charClasses.find( c => (c.id.classID == charClass.charClass.classID) ) )
        {
            deleteClass ( charClass );
        }
        // Special case for if we're adding an archetype to an existing class
        else if ( charClass.charClass.archetype.classID !== undefined )
        {
            const updateJSON = {};
            updateJSON.charClasses = [];

            const classJSON = {};
            classJSON.charClass = charClass.charClass;
            classJSON.level = (character.raw.charClasses.find( c => ( c.id.classID == charClass.charClass.archetype.classID))).level;

            const idJSON = {};
            idJSON.classID = charClass.classID;
            idJSON.characterID = character.raw.characterID;
            classJSON.id = idJSON;

            updateJSON.charClasses.push({...classJSON});


            props.update(updateJSON);
        }
        else
        {
        }
    }

    function deleteClass ( charClass )
    {
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
            idJSON.characterID = character.raw.characterID;
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
        idJSON.characterID = character.raw.characterID;
        classJSON.id = idJSON;

        updateJSON.charClasses.push({...classJSON});

        props.update(updateJSON);
    }

    function expansionSlot( charClass )
    {
        if ( expansionJSON[charClass.id.classID] == true )
        {
            return (
                <>
                    <CharacterClassInfo key={charClass.id.classID + "Info"} id={charClass.id.classID + "Info"} character={character} charClass={charClass} />
                    <ExpandTableRow expand={() => expandInfo(charClass.id.classID)} maxCols={3} down={false} />
                </>
        );
        }
        else
        {
            return (<ExpandTableRow expand={() => expandInfo(charClass.id.classID)} maxCols={3} down={true} />);
        }
    }

    if ( character.raw !== undefined )
    {
        return (
            <table>
            <thead>
                <tr>
                    <td>Class Name</td>
                    <td>Archetypes</td>
                    <td>Level</td>
                </tr>
            </thead>
            <tbody>
                { character.derived.charClasses.map( charClass => (
                    <React.Fragment key={charClass.id.classID + "Fragment"}>
                        <CharacterClassRow key={charClass.id.classID + "Row"} charClass={charClass} editMode={props.editMode} update={updateClass}/>
                        {expansionSlot( charClass )}
                    </React.Fragment>
                ))}
                <tr>
                    <td colSpan={3}>
                        <table>
                            <tbody>
                                <NewCharacterClass editMode={props.editMode} character={character} add={addClass}/>
                                <CharacterClassToAdd classes={characterClassesToAdd} addClass={postClass}/>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
            </table>
        )
    }
    else
    {
        return <></>
    }
}