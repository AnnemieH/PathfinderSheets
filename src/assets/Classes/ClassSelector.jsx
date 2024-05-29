import { useEffect, useState } from "react"

// PROPS
// seedClass - the reference class to generate archetypes. Possible values are a class, in which case this will let you select from all archetypes of the class
//                                                         "all" in which case all classes are available for selection
//                                                         or no value will be passed in which case give all base classes
// classSelected - a function to call whenever a class is selected
// filter - an additional filter function
export default function ClassSelector ( props )
{
    const [allClasses, setAllClasses] = useState([]);
    const [filteredClasses, setFilteredClasses] = useState([]);


    // Load in all classes
    useEffect(() => {
        const url = "http://localhost:8080/class/allClasses";

        fetch(url)
        .then( res => res.json() )
        .then( data => setAllClasses(data) );
    }, []);

    // Once classes are loaded in or seedClass is changed, filter to those 
    // which are archetypes of the given class
    useEffect(() => 
    {
        // Check to see if allClasses has been set yet
        if ( allClasses.length !== 0 )
        {
            if ( props.seedClass === undefined )
            {
                setFilteredClasses( filterFunction( baseClassFilter() ) );
            }
            else if ( props.seedClass.classID !== undefined && props.seedClass.archetype === undefined )
            {
                setFilteredClasses( filterFunction( seedClassFilter() ) );
            }
            else
            {
                setFilteredClasses( filterFunction( allClasses ) );
            }
        }
    }, [allClasses, props.seedClass, props.filter])

    // Filter allClasses to return only those which are not themselves archetypes
    function baseClassFilter()
    {
        return allClasses.filter( charClass => (charClass.archetype === undefined) );
    }

    // Filter allClasses to return only those which are archetypes of the current seedClass
    function seedClassFilter()
    {
        return allClasses.filter( charClass => 
        {
            if ( charClass.archetype === undefined )
            {
                return false;
            }
            else
            {
                return charClass.archetype.classID == props.seedClass.classID;
            }
        });
    }

    function filterFunction( input )
    {
        // Check if we have a filter function, if not, return input unchanged.
        // Otherwise filter according to the function
        if ( props.filter === undefined )
        {
            return input;
        }
        else
        {
            return props.filter(input);
        }

    }

    // Handle a change in the classSelector
    function classChanged ( event )
    {
        // If the value is not an integer, clear class in parent
        if ( isNaN(parseInt(event.target.value)))
        {
            props.classSelected({})
        }
        // Otherwise set the class in the parent to be the one selected here
        else
        {
            props.classSelected(filteredClasses.find((elem) => elem.classID == event.target.value))
        }
    }

    // Only return a selector if there are things to select
    if ( filteredClasses !== undefined && filteredClasses.length > 0 )
    {
        return (
            <select name="classSelector"  onChange={classChanged}>
                <option value="placeholder">No class</option>
                {filteredClasses.map(base => (
                    <option key={base.classID} value={base.classID}>{base.className}</option>
                ))}
            </select>
        );
    }
    else
    {
        return ( <></> );
    }
}