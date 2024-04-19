import { useEffect, useState } from "react";
import BaseClassSelector from "../../Classes/BaseClassSelector";
import SpellsPerDayTable from "../../Spells/SpellsPerDayTable";
import SkillSelector from "../../Skills/SkillSelector";
import SpellKnownTable from "../../Spells/SpellKnownTable";
import BuffList from "../../Buffs/BuffList";
import BuffSelector from "../../Buffs/BuffSelector";

export default function NewClass ( props )
{
    const [name, setName] = useState("");
    const [baseClass, setBaseClass] = useState({});
    const [isPrestige, setIsPrestige] = useState(false);
    const [hitDie, setHitDie] = useState(0);
    const [bab, setBab] = useState({});
    const [fortitude, setFortitude] = useState({});
    const [reflex, setReflex] = useState({});
    const [will, setWill] = useState({});
    const [buffs, setBuffs] = useState([]);
    const [isSpellcaster, setIsSpellcaster] = useState(false);
    const [castingStat, setCastingStat] = useState({})
    const [casterType, setCasterType] = useState({});
    const [spellList, setSpellList] = useState({});
    const [magicSource, setMagicSource] = useState({});
    const [spellsPerDay, setSpellsPerDay] = useState({});
    const [spellsKnown, setSpellsKnown] = useState({});
    const [skillsPerLevel, setSkillsPerLevel] = useState(0);
    const [classSkills, setClassSkills] = useState([]);

    const [spellsKnownCategory, setSpellsKnownCategory] = useState("");
    const [maxLevel, setMaxLevel] = useState(20);
    const [minSpellsKnownLevel, setMinSpellsKnownLevel] = useState(0);
    const [maxSpellLevel, setMaxSpellLevel] = useState(9);

    const [remainingFields, setRemainingFields] = useState([]);

    const [allAttributes, setAllAttributes] = useState([]);
    const [allCasterTypes, setAllCasterTypes] = useState([]);
    const [allSpellLists, setAllSpellLists] = useState([]);
    const [allMagicSources, setAllMagicSources] = useState([]);

    const [postJSON, setPostJSON] = useState({});

    // Store all the basic attributes in an array
    useEffect(() => {
        const url = "http://localhost:8080/attribute/allAttributes";

        fetch(url)
        .then(res => res.json())
        .then(data => setAllAttributes(data));
    }, [])

    // Store all caster types in an array
    useEffect(() => {
        const url = "http://localhost:8080/spellcasterTypes/allSpellcasterTypes";

        fetch(url)
        .then(res => res.json())
        .then(data => setAllCasterTypes(data));
    }, [])

    // Store all spell lists in an array
    useEffect(() => {
        const url = "http://localhost:8080/spellList/all";

        fetch(url)
        .then(res => res.json())
        .then(data => setAllSpellLists(data));
    }, [])

    // Store all magic source types in an array
    useEffect(() => {
        const url = "http://localhost:8080/magicSource/all";

        fetch(url)
        .then(res => res.json())
        .then(data => setAllMagicSources(data));
    }, [])

    // Store all initial necessary fields in remainingFields on creation
    useEffect(() => {
        let tempArray = [];

        tempArray.push(document.getElementById("name"));
        tempArray.push(document.getElementById("hitDie"));
        tempArray.push(document.getElementById("babRate"));
        tempArray.push(document.getElementById("fortRate"));
        tempArray.push(document.getElementById("refRate"));
        tempArray.push(document.getElementById("willRate"));
        tempArray.push(document.getElementById("skillRanks"));
        tempArray.push(document.getElementById("classSkills"));

        setRemainingFields(tempArray);
    }, [])

    // If isSpellcaster is true, add more necessary fields to remainingFields
    useEffect(() => {
        const fieldArray = 
        [
            "castingStat",
            "spellcasterType",
            "spellList",
            "magicSource",
            "spellsKnownCategory",
            "spellsPerDay"
        ];

        if ( isSpellcaster )
        {
            let tempArray = [];

            fieldArray.map(field => tempArray.push(document.getElementById(field)));

            setRemainingFields(remainingFields.concat(tempArray));
        }
        else if ( remainingFields.length > 0 )
        {
            let tempArray = remainingFields.filter(field => (!fieldArray.includes(field.id)))

            // If spellsKnown has been added, remove that too
            if ( tempArray.includes(document.getElementById("spellsKnown") ))
            {
                tempArray = tempArray.filter( field => field.id == "spellsKnown" );
            }

            setRemainingFields(tempArray);
        }
    }, [isSpellcaster])

    // Once spellsKnownCategory is set, add another field to remainingFields if appropriate
    useEffect(() => {
        if( spellsKnownCategory === "perLevel" || spellsKnownCategory === "complex" )
        {
            let tempArray = [];
            tempArray.push(document.getElementById("spellsKnown"));

            
        }
    }, [spellsKnownCategory])

    function parentClassNameNeeded ( field )
    {
        if ( !field.parentNode.className.includes("stillNeeded"))
        {
            field.parentNode.className += " stillNeeded";
        }
    }

    // Change the class of remainingFields' parent so they can be styled differently
    useEffect(() => {
        remainingFields.map(field => (
            parentClassNameNeeded( field )
        ));
    }, [remainingFields])

    function removeRemainingField ( field )
    {
        if ( remainingFields.includes(field) )
        {
            field.parentNode.className = field.parentNode.className.substring(
                0, field.parentNode.className.length - 12
            );
            setRemainingFields( remainingFields.filter( remField => remField != field ));
        }
    }

    function nameChange ( event )
    {
        setName(event.target.value);

        // If it is a valid name, remove name from remaining fields, otherwise ensure that it's there
        if ( nameValidation( event.target.value ) )
        {
            removeRemainingField(event.target)
        }
        else
        {
            if ( !remainingFields.includes( event.target ))
            {
                setRemainingFields( remainingFields.concat( event.target ) );
            }
        }
    }

    // Check that the name is valid
    function nameValidation ( input )
    {
        // Is the name a string?
        if ( typeof(input) !== "string" )
        {
            return false;
        }
        else if ( input.length === 0 )
        {
            return false;
        }

        return true;
        
    }

    function baseClassSelected ( newBaseClass )
    {
        setBaseClass( newBaseClass );
    }

    function prestigeSelected ()
    {
        setIsPrestige(!isPrestige);
    }

    function hitDieSelected ( event )
    {
        if ( event.target.value === "placeholder" )
        {
            setHitDie( 0 );

            // This is an invalid value so make sure it is represented in remainingFields
            if ( !remainingFields.includes( event.target ))
            {
                setRemainingFields( remainingFields.concat( event.target ) );
            }
        }
        else
        {
            setHitDie( event.target.value );

            // This is a valid value so remove from remainingFields
            removeRemainingField(event.target)
        }
    }

    function babSelected ( event )
    {
        // If BAB is unselected, clear JSON
        // Otherwise create a JSON corresponding to the three BAB progressions
        if ( event.target.value === "placeholder" )
        {
            setBab({});

            // This is an invalid value so make sure it is represented in remainingFields
            if ( !remainingFields.includes( event.target ))
            {
                setRemainingFields( remainingFields.concat( event.target ) );
            }
        }
        else if ( event.target.value === "half")
        {
            setBab ({
                "1": "0",
                "2": "1",
                "3": "1",
                "4": "2",
                "5": "2",
                "6": "3",
                "7": "3",
                "8": "4",
                "9": "4",
                "10": "5",
                "11": "5",
                "12": "6",
                "13": "6",
                "14": "7",
                "15": "7",
                "16": "8",
                "17": "8",
                "18": "9",
                "19": "9",
                "20": "10",
            });

            // This is a valid value so remove from remainingFields
            removeRemainingField(event.target)
        }
        else if ( event.target.value === "twothirds")
        {
            setBab ({
                "1": "0",
                "2": "1",
                "3": "2",
                "4": "3",
                "5": "3",
                "6": "4",
                "7": "5",
                "8": "6",
                "9": "6",
                "10": "7",
                "11": "8",
                "12": "9",
                "13": "9",
                "14": "10",
                "15": "11",
                "16": "12",
                "17": "12",
                "18": "13",
                "19": "14",
                "20": "15",
            });

            // This is a valid value so remove from remainingFields
            removeRemainingField(event.target)
        }
        else if ( event.target.value === "one")
        {
            setBab({
                "1": "1",
                "2": "2",
                "3": "3",
                "4": "4",
                "5": "5",
                "6": "6",
                "7": "7",
                "8": "8",
                "9": "9",
                "10": "10",
                "11": "11",
                "12": "12",
                "13": "13",
                "14": "14",
                "15": "15",
                "16": "16",
                "17": "17",
                "18": "18",
                "19": "19",
                "20": "20",
            });

            // This is a valid value so remove from remainingFields
            removeRemainingField(event.target)
        }
    }

    // Convert a rate into a JSON for save progressions
    function saveProgression ( rate )
    {
        if ( rate === "good" )
        {
            return {
                "1": "2",
                "2": "3",
                "3": "3",
                "4": "4",
                "5": "4",
                "6": "5",
                "7": "5",
                "8": "6",
                "9": "6",
                "10": "7",
                "11": "7",
                "12": "8",
                "13": "8",
                "14": "9",
                "15": "9",
                "16": "10",
                "17": "10",
                "18": "11",
                "19": "11",
                "20": "12",
            }
        }
        else if ( rate === "poor" )
        {
            return {
                "1": "0",
                "2": "0",
                "3": "1",
                "4": "1",
                "5": "1",
                "6": "2",
                "7": "2",
                "8": "2",
                "9": "3",
                "10": "3",
                "11": "3",
                "12": "4",
                "13": "4",
                "14": "4",
                "15": "5",
                "16": "5",
                "17": "5",
                "18": "6",
                "19": "6",
                "20": "6",
            }
        }
        else
        {
            return {};
        }
    }

    function fortSelected ( event )
    {
        // Set fortitude based on the two save progressions
        setFortitude( saveProgression(event.target.value) );

        if( event.target.value != "placeholder" )
        {
            // This is a valid value so remove from remainingFields
            removeRemainingField(event.target)
        }
        else
        {
            // This is an invalid value so make sure it is represented in remainingFields
            if ( !remainingFields.includes( event.target ))
            {
                setRemainingFields( remainingFields.concat( event.target ) );
            }
        }
    }

    function refSelected ( event )
    {
        setReflex( saveProgression(event.target.value) );

        if( event.target.value != "placeholder" )
        {
            // This is a valid value so remove from remainingFields
            removeRemainingField(event.target)
        }
        else
        {
            // This is an invalid value so make sure it is represented in remainingFields
            if ( !remainingFields.includes( event.target ))
            {
                setRemainingFields( remainingFields.concat( event.target ) );
            }
        }
    }

    function willSelected ( event )
    {
        setWill( saveProgression(event.target.value) );

        if( event.target.value != "placeholder" )
        {
            // This is a valid value so remove from remainingFields
            removeRemainingField(event.target)
        }
        else
        {
            // This is an invalid value so make sure it is represented in remainingFields
            if ( !remainingFields.includes( event.target ))
            {
                setRemainingFields( remainingFields.concat( event.target ) );
            }
        }
    }

    function setSpellcaster ()
    {
        setIsSpellcaster( !isSpellcaster );
    }

    function castingStatSelected ( event )
    {
        if ( event.target.value === "placeholder" )
        {
            setCastingStat({});

            // This is an invalid value so make sure it is represented in remainingFields
            if ( !remainingFields.includes( event.target ))
            {
                setRemainingFields( remainingFields.concat( event.target ) );
            }
        }
        else
        {
            setCastingStat(allAttributes.find( element => event.target.value == element.attributeID));

            // This is a valid value so remove from remainingFields
            removeRemainingField(event.target)
        }
    }

    function casterTypeSelected ( event )
    {
        if ( event.target.value === "placeholder" )
        {
            setCasterType({})

            // This is an invalid value so make sure it is represented in remainingFields
            if ( !remainingFields.includes( event.target ))
            {
                setRemainingFields( remainingFields.concat( event.target ) );
            }
        }
        else
        {
            setCasterType(allCasterTypes.find(type => event.target.value == type.spellcasterTypeID));

            // This is a valid value so remove from remainingFields
            removeRemainingField(event.target)
        }
    }

    function spellListSelected ( event )
    {
        if ( event.target.value === "placeholder" )
        {
            setSpellList({});

            // This is an invalid value so make sure it is represented in remainingFields
            if ( !remainingFields.includes( event.target ))
            {
                setRemainingFields( remainingFields.concat( event.target ) );
            }
        }
        else
        {
            setSpellList(allSpellLists.find(spellList => event.target.value == spellList.spellListID))

            // This is a valid value so remove from remainingFields
            removeRemainingField(event.target)
        }
    }

    function magicSourceSelected ( event )
    {
        if( event.target.value === "placeholder" )
        {
            setMagicSource({});

            // This is an invalid value so make sure it is represented in remainingFields
            if ( !remainingFields.includes( event.target ))
            {
                setRemainingFields( remainingFields.concat( event.target ) );
            }
        }
        else
        {
            setMagicSource(allMagicSources.find(elem => event.target.value == elem.magicSourceID));

            // This is a valid value so remove from remainingFields
            removeRemainingField(event.target)
        }
    }

    // Validation for spell table JSONs
    function validSpells ( input )
    {
        for ( let level in input )
        {
            for ( let spellLevel in input[level])
            {

                // If the element is not null, make sure it's an integer
                if ( input[level][spellLevel] != null )
                {
                    if ( isNaN(parseInt(input[level][spellLevel])))
                    {
                        return false;
                    }
                }

                // Make sure that the element above exists
                if ( input.hasOwnProperty( parseInt(level) - 1 ) )
                {
                    // If the current element is null, make sure that the element above is also null
                    if ( input[level][spellLevel] == null )
                    {
                        if ( input[ level - 1 ][spellLevel] != null )
                        {
                            return false;
                        }
                    }

                    // Otherwise make sure that the current element is no smaller than the one above
                    if ( parseInt(input[ level - 1 ][spellLevel]) > parseInt(input[level][spellLevel]) )
                    {
                        return false;
                    }
                }
                
                // Make sure that the element to the right exists
                if ( input[level].hasOwnProperty( parseInt(spellLevel) + 1 ) )
                {
                    // If the current element is null, make sure that the element to the right is also null
                    if ( input[level][spellLevel] == null )
                    {
                        if ( input[level][ parseInt(spellLevel) + 1 ] != null )
                        {
                            return false;
                        }
                    }
                    
                    // Otherwise make sure that the current element is no smaller than the one to the right
                    if ( parseInt(input[level][ parseInt(spellLevel) + 1 ]) > parseInt(input[level][spellLevel]) )
                    {
                        return false;
                    }
                }
            }
        }

        return true;
    }

    function spellsPerDayChanged ( input )
    {
        setSpellsPerDay({...input});

        console.log(validSpells( input["table"] ))

        if ( validSpells( input["table"] ) )
        {
            // This is a valid value so remove from remainingFields
            removeRemainingField(document.getElementById("spellsPerDay"));
        }
        else
        {
            // This is an invalid value so make sure it is represented in remainingFields
            if ( !remainingFields.includes( document.getElementById("spellsPerDay") ))
            {
                setRemainingFields( remainingFields.concat( document.getElementById("spellsPerDay") ) );
            }
        }
    }

    function spellsKnownChanged ( input )
    {
        setSpellsKnown({...input});

        if ( validSpells( input["table"] ) )
        {
            // This is a valid value so remove from remainingFields
            removeRemainingField(document.getElementById("spellsKnown"));
        }
        else
        {
            // This is an invalid value so make sure it is represented in remainingFields
            if ( !remainingFields.includes( document.getElementById("spellsKnown") ))
            {
                setRemainingFields( remainingFields.concat( document.getElementById("spellsKnown") ) );
            }
        }
    }

    function skillsPerLevelChanged ( event )
    {
        if ( event.target.value === "placeholder" || event.target.value === "" )
        {
            setSkillsPerLevel(0);
        }
        else
        {
            setSkillsPerLevel( parseInt(event.target.value) );
        }

        // If it is a valid skill number, remove skillsPerLevel from remaining fields, otherwise ensure that it's there
        if ( parseInt(event.target.value) > 0 )
        {
            removeRemainingField(event.target)
        }
        else
        {
            if ( !remainingFields.includes( event.target ))
            {
                setRemainingFields( remainingFields.concat( event.target ) );
            }
        }
    }

    function classSkillsSelected ( input )
    {
        setClassSkills ( input );

        // If it is a positive number of class skills, remove classSkills from remaining fields, otherwise ensure that it's there
        if ( input.length > 0 )
        {
            removeRemainingField(document.getElementById("classSkills"))
        }
        else
        {
            if ( !remainingFields.includes( document.getElementById("classSkills") ))
            {
                setRemainingFields( remainingFields.concat( document.getElementById("classSkills") ) );
            }
        }
    }



    function changeSpellsKnownCategory ( event )
    {
        setSpellsKnownCategory( event.target.value )

        if ( spellsKnownCategory === "placeholder" )
        {
            setSpellsKnown({"category": null})
        }
        else
        {
            setSpellsKnown({"category": event.target.value});
        }
    }

    function maxSpellLevelChanged ( event )
    {
        if ( !isNaN(parseInt(event.target.value))  && event.target.value != "" )
        {
            setMaxSpellLevel(event.target.value);
        }
        else
        {
            setMaxSpellLevel(9);
        }
    }

    function minKnownSpellLevelChanged ( event )
    {
        if ( !isNaN(parseInt(event.target.value)) && event.target.value != "")
        {
            setMinSpellsKnownLevel(event.target.value);
        }
        else
        {
            setMinSpellsKnownLevel(0);
        }
    }

    // If the class is based off another class, populate options based off that base class, otherwise clear it
    useEffect(() => {
        if( Object.keys(baseClass).length > 0 )
        {
            setIsPrestige( false );
            setHitDie( baseClass.hitDie );
            setBab( baseClass.bab );
            setFortitude( baseClass.fortitude );
            setReflex( baseClass.reflex );
            setWill( baseClass.will );
            setBuffs( baseClass.buffs );

            // Check to see if one of the spellcasting stats is null to determine whether this is a spellcasting class
            if ( typeof(baseClass.castingStat) === "undefined" )
            {
                setIsSpellcaster( false );
            }
            else
            {
                setIsSpellcaster( true );
                setCastingStat( baseClass.castingStat );
                setCasterType( baseClass.casterType );
                setSpellList( baseClass.spellList );
                setMagicSource( baseClass.magicSource );
                setSpellsPerDay( baseClass.spellsPerDay );
                setSpellsKnownCategory ( baseClass.spellsKnown["category"] )
                setSpellsKnown( baseClass.spellsKnown );
            }
            setSkillsPerLevel( baseClass.skillRanks );
            setClassSkills( baseClass.classSkills );
        }
        else
        {
            setIsPrestige( false );
            setHitDie( 0 );
            setBab( {} );
            setFortitude( {} );
            setReflex( {} );
            setWill( {} );
            setBuffs( [] );
            setIsSpellcaster( false );
            setCastingStat( {} );
            setCasterType( {} );
            setSpellList( {} );
            setMagicSource( {} );
            setSpellsPerDay( {} );
            setSpellsKnown( {} );
            setSkillsPerLevel( 0 );
            setClassSkills( [] );
        }

        // Then update the displayed information
        updateBaseClass();

    }, [baseClass])

    // Convert a BAB JSON into a description
    function babJSONToDesc ( input )
    {
        if ( typeof(input) !== "object" )
        {
            return "placeholder";
        }
        else if ( input["3"] == 3 )
        {
            return "one";
        }
        else if ( input["3"] == 2 )
        {
            return "twothirds";
        }
        else if ( input["3"] == 1 )
        {
            return "half";
        }
        else 
        {
            return "placeholder";
        }
        
    }

    // Convert a save JSON into a description
    function saveJSONToDesc ( input )
    {
        if ( typeof(input) !== "object" )
        {
            return "placeholder";
        }
        else if ( input.length === 0)
        {
            return "placeholder";
        }
        else if ( input["1"] == 2 )
        {
            return "good";
        }
        else if ( input["1"] == 0 )
        {
            return "poor";
        }
        else 
        {
            return "placeholder";
        }
        
    }

    // Update the displayed information using baseClass. rather than any of the states which may not have finished setting yet.
    function updateBaseClass ()
    {
        if( Object.keys(baseClass).length > 0 )
        {
            document.getElementById("hitDie").value = baseClass.hitDie;
            document.getElementById("babRate").value = babJSONToDesc(JSON.parse(baseClass.bab));
            document.getElementById("fortRate").value = saveJSONToDesc(JSON.parse(baseClass.fortitude));
            document.getElementById("refRate").value = saveJSONToDesc(JSON.parse(baseClass.reflex));
            document.getElementById("willRate").value = saveJSONToDesc(JSON.parse(baseClass.will));
            // document.getElementById().value = 

            // Check to see if one of the spellcasting stats is null to determine whether this is a spellcasting class
            if ( typeof(baseClass.castingStat) === "undefined" )
            {
                document.getElementById("isSpellcaster").value = false;
                document.getElementById("isSpellcaster").checked = false;
            }
            else
            {
                document.getElementById("isSpellcaster").value = true;
                document.getElementById("isSpellcaster").checked = true;
            }

            // Only check the spellcasting stats if the class is a spellcaster
            if ( document.getElementById("isSpellcaster").value === true )
            {
                document.getElementById("castingStat").value = baseClass.castingAbility.attributeName;
                document.getElementById("casterType").value = baseClass.casterType.spellcasterTypeName;
                document.getElementById("spellList").value = baseClass.spellList.spellListName;
                document.getElementById("magicSource").value = baseClass.magicSource.magicSourceName;
                document.getElementById("spellsPerDay").value = baseClass.spellsPerDay;

                // Parse spells known
                document.getElementById("spellsKnownCategory").value = baseClass.spellsKnown["category"];


                
            }
            document.getElementById("skillRanks").value = baseClass.skillRanks;
            // document.getElementById("").value = 
        }
        else
        {
            document.getElementById("hitDie").value = "placeholder";
            document.getElementById("babRate").value = "placeholder";
            document.getElementById("fortRate").value = "placeholder";
            document.getElementById("refRate").value = "placeholder";
            document.getElementById("willRate").value = "placeholder";
            // document.getElementById().value = 
            document.getElementById("isSpellcaster").value = false;
            document.getElementById("isSpellcaster").checked = false;

            // Ignore the spellcasting stats as they no longer exist
            // document.getElementById("").value = 
            // document.getElementById("").value = 
            // document.getElementById("").value = 
            // document.getElementById("").value = 
            document.getElementById("skillRanks").value = "";
            // document.getElementById("").value = 
        }
    }

    // Change the max class level based on whether this is a prestige class
    useEffect(() => {
        if ( isPrestige )
        {
            setMaxLevel(10);
        }
        else
        {
            setMaxLevel(20);
        }
    }, [isPrestige])

    return (
        <table className="classTable">
            <thead >
                <tr><td className="classTableTitle" colSpan="100%">New Class</td></tr>
            </thead>
            <tbody>
                <tr>
                    <td className="classTableTopPanel" colSpan="3">
                        <table className="classTableTopPanelTable" >
                            <tbody>
                                <tr>
                                    <td>
                                        <label htmlFor="name">Name of class: </label>
                                    </td>
                                    <td>
                                        <input type="text" id="name" name="name" onChange={nameChange}/>
                                    </td>
                                    <td>
                                        <label htmlFor="archetype">Archetype of: </label>
                                    </td>
                                    <td>
                                        <BaseClassSelector baseClassSelected={baseClassSelected}/>
                                    </td>
                                    <td>
                                        <label htmlFor="prestige">Is prestige class?</label>
                                    </td>
                                    <td>
                                        <input type="checkbox" id="prestige" name="prestige" onChange={prestigeSelected} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td className="classTablePanel">
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <label htmlFor="hitDie">Hit die: </label>
                                    </td>
                                    <td>
                                        <select name="hitDie" id="hitDie" onChange={hitDieSelected}>
                                            <option value="placeholder">Select hit die</option>
                                            <option value="6">D6</option>
                                            <option value="8">D8</option>
                                            <option value="10">D10</option>
                                            <option value="12">D12</option>
                                        </select>
                                    </td>
                                    <td>
                                        <label htmlFor="babRate">BAB: </label>
                                    </td>
                                    <td>
                                        <select name="babRate" id="babRate" onChange={babSelected}>
                                            <option value="placeholder">Select BAB</option>
                                            <option value="half">1/2</option>
                                            <option value="twothirds">2/3</option>
                                            <option value="one">Full</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <label htmlFor="fortRate">Fortitude: </label>
                                    </td>
                                    <td>
                                        <select name="fortRate" id="fortRate" onChange={fortSelected}>
                                            <option value="placeholder">Select fortitude</option>
                                            <option value="good">Good</option>
                                            <option value="poor">Poor</option>
                                        </select>
                                    </td>
                                    <td>
                                        <label htmlFor="refRate">Reflex: </label>
                                    </td>
                                    <td>
                                        <select name="refRate" id="refRate" onChange={refSelected}>
                                            <option value="placeholder">Select reflex</option>
                                            <option value="good">Good</option>
                                            <option value="poor">Poor</option>
                                        </select>
                                    </td>
                                    <td>
                                        <label htmlFor="willRate">Will: </label>
                                    </td>
                                    <td>
                                        <select name="willRate" id="willRate" onChange={willSelected}>
                                            <option value="placeholder">Select will</option>
                                            <option value="good">Good</option>
                                            <option value="poor">Poor</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={6}>
                                        <BuffList inheritedBuffs={buffs} />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={6}>
                                        <BuffSelector />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                    <td className="classTablePanel">
                        <table>
                            <tbody>
                                <tr>
                                    <td colSpan={3} className="right">
                                        <label htmlFor="isSpellcaster">Spellcaster? </label>
                                    </td>
                                    <td className="spellcasterCheckboxCell left" colSpan={3}>
                                        <input type="checkbox" name="isSpellcaster" id="isSpellcaster" onChange={setSpellcaster}/>
                                    </td>                                    
                                </tr>
                                <tr>
                                    {/* Only render the next block if isSpellcaster is checked */}
                                    {isSpellcaster  && <>
                                    <td>
                                        <label htmlFor="castingStat">Casting stat</label>
                                    </td>
                                    <td>
                                        <select name="castingStat" id="castingStat" onChange={castingStatSelected}>
                                            <option value="placeholder">Choose stat</option>
                                            {allAttributes.map(attribute => (
                                                <option key={attribute.attributeID} value={attribute.attributeID}>{attribute.attributeName}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <label htmlFor="spellcasterType">Type</label>
                                    </td>
                                    <td>
                                        <select name="spellcasterType" id="spellcasterType" onChange={casterTypeSelected}>
                                            <option value="placeholder">Spellcaster type</option>
                                            {allCasterTypes.map(castType => (
                                                <option key={castType.spellcasterTypeID} value={castType.spellcasterTypeID}>{castType.spellcasterTypeName}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <label htmlFor="spellList">Spell list</label>
                                    </td>
                                    <td>
                                        <select name="spellList" id="spellList" onChange={spellListSelected}>
                                            <option value="placeholder">Spell List</option>
                                            {allSpellLists.map(spellList => (
                                                <option key={spellList.spellListID} value={spellList.spellListID}>{spellList.spellListName}</option>
                                            ))}
                                        </select>
                                    </td></>}
                                </tr>
                                {/* Only render the next block if isSpellcaster is checked */}
                                {isSpellcaster &&
                                <tr>
                                    <td>
                                        <label htmlFor="magicSource">Magic source</label>
                                    </td>
                                    <td>
                                        <select name="magicSource" id="magicSource" onChange={magicSourceSelected}>
                                            <option value="placeholder">Source</option>
                                            {allMagicSources.map(source => (
                                                <option key={source.magicSourceID} value={source.magicSourceID}>{source.magicSourceName}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td colSpan="3">
                                        <label htmlFor="spellsKnownCategory">Spells known category</label>
                                    </td>
                                    <td>
                                        <select name="spellsKnownCategory" id="spellsKnownCategory" onChange={changeSpellsKnownCategory}>
                                            <option value="placeholder">Category</option>
                                            <option value="unlimited">Unlimited</option>
                                            <option value="perLevel">Fixed per level</option>
                                            <option value="complex">Complex</option>
                                        </select>
                                    </td>
                                </tr>}
                                {/* Only render the next block if isSpellcaster is checked */}
                                {isSpellcaster &&
                                <tr>
                                    <td>
                                        <label htmlFor="maxSpellLevel">Maximum spell level</label>
                                    </td>
                                    <td>
                                        <input type="text" name="maxSpellLevel" id="maxSpellLevel" onChange={maxSpellLevelChanged} />
                                    </td>
                                    <td colSpan="3">
                                        <label htmlFor="minKnownSpellLevel">Minimum spell level for learning</label>
                                    </td>
                                    <td>
                                        <input type="text" name="minKnownSpellLevel" id="minKnownSpellLevel" onChange={minKnownSpellLevelChanged} />
                                    </td>
                                </tr>}
                                {/* Only render the next block if isSpellcaster is checked */}
                                {isSpellcaster &&
                                <tr>
                                    <td colSpan="8">
                                        <table>
                                            <thead>
                                                <tr>
                                                    <td>Spells Per Day</td>
                                                    <td>Spells Known</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><SpellsPerDayTable id="spellsPerDay" minSpellLevel="1" maxSpellLevel={maxSpellLevel} maxLevel={maxLevel} value="{}" change={spellsPerDayChanged}/></td>
                                                    <td><SpellKnownTable id="spellsKnown" minSpellLevel={minSpellsKnownLevel} maxSpellLevel={maxSpellLevel} maxLevel={maxLevel} spellsKnown={spellsKnown} change={spellsKnownChanged} /> </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>}
                            </tbody>
                        </table>
                    </td>
                    <td className="classTablePanel">
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <label htmlFor="skillRanks">Skill ranks per level</label>
                                    </td>
                                    <td>
                                        <input type="text" name="skillRanks" id="skillRanks" size={1} onChange={skillsPerLevelChanged}/>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2"><h3>Class Skills</h3></td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <SkillSelector id="classSkills" classSkillsSelected={classSkillsSelected}/>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    )
}