import { useState } from "react"
import ClassSelector from "../../Classes/ClassSelector";
import { isArchetypeCompatible } from "../../Classes/Functions/compatibleArchetypes";

// PROPS
// editMode - a boolean flag to track whether we're editing or not
// character - keep track of the current character to prevent adding duplicate classes
// add( class ) - a function to pass to the parent a class we're adding
export default function NewCharacterClass ( props )
{
    const [addNewClass, setAddNewClass] = useState(false);
    const [baseClass, setBaseClass] = useState({});
    const [selectedArchetypes, setSelectedArchetypes] = useState([]);

    function addingNewClass()
    {
        setAddNewClass(true);
    }

    function baseClassSelected ( selectedClass )
    {
        setBaseClass(selectedClass);
        props.add( selectedClass );
    }

    // Filter out any classes that are present in props.character already
    function duplicateClassFilter ( classArray )
    {
        let filteredArray = [...classArray];
        filteredArray = filteredArray.filter( x => props.character.raw.charClasses.find(y => x.classID === y.id.classID) === undefined );

        return filteredArray;
    }

    function archetypeSelected ( selectedClass )
    {
        selectedArchetypes.push( selectedClass );
        props.add( selectedClass );
    }

    function archetypeFilter ( classArray )
    {
        // If we don't have a base class, filter out everything
        if ( baseClass.classID === undefined )
        {
            return [];
        }
        else
        {
            let filteredArray = [...classArray];
            filteredArray = filteredArray.filter(x => isArchetypeCompatible(x, selectedArchetypes))
            return filteredArray;
        }
    }

    if ( props.editMode == true && addNewClass == false )
    {
        return (
            <tr onClick={addingNewClass}>
                <td colSpan={5}>
                    Add new class
                </td>
            </tr>
        );
    }
    else if ( props.editMode == true && addNewClass == true )
        {
            return (
                <tr>
                    <td colSpan={5}>
                        <form>
                            <ClassSelector classSelected={baseClassSelected} filter={duplicateClassFilter}/>                            
                            <ClassSelector classSelected={archetypeSelected} seedClass={baseClass} filter={archetypeFilter}/>
                        </form>
                    </td>
                </tr>
            );
        }
    else
    {
        return (
            <tr>
            </tr>
        );
    }
}