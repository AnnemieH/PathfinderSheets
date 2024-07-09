import { useEffect, useState } from "react";
import ClassSelector from "../../Classes/ClassSelector";
import SpellsPerDayTable from "../../Spells/SpellsPerDayTable";
import SkillSelector from "../../Skills/SkillSelector";
import SpellKnownTable from "../../Spells/SpellKnownTable";
import ClassFeatureList from "../../ClassFeatures/ClassFeatureList";
import ClassFeatureSelector from "../../ClassFeatures/ClassFeatureSelector";

export default function NewClass ( props )
{
    const [name, setName] = useState("");
    const [baseClass, setBaseClass] = useState({});
    const [isPrestige, setIsPrestige] = useState(false);
    const [hitDie, setHitDie] = useState(0);
    const [bab, setBab] = useState("");
    const [fortitude, setFortitude] = useState("");
    const [reflex, setReflex] = useState("");
    const [will, setWill] = useState("");
    const [inheritedClassFeatures, setInheritedClassFeatures] = useState([]);                   // All buffs inherited from the base class
    const [filteredInheritedClassFeatures, setFilteredInheritedClassFeatures] = useState([]);   // Only the buffs we wish to keep from the inherited class
    const [classFeatures, setClassFeatures] = useState([]);
    const [isSpellcaster, setIsSpellcaster] = useState(false);
    const [castingStat, setCastingStat] = useState({})
    const [casterType, setCasterType] = useState({});
    const [spellList, setSpellList] = useState({});
    const [magicSource, setMagicSource] = useState({});
    const [spellsPerDay, setSpellsPerDay] = useState({});
    const [spellsPerDayString, setSpellsPerDayString] = useState("");
    const [spellsKnown, setSpellsKnown] = useState({});
    const [spellsKnownString, setSpellsKnownString] = useState("");
    const [skillsPerLevel, setSkillsPerLevel] = useState(0);
    const [classSkills, setClassSkills] = useState([]);

    const [maxLevel, setMaxLevel] = useState(20);
    const [minSpellsKnownLevel, setMinSpellsKnownLevel] = useState(0);
    const [maxSpellLevel, setMaxSpellLevel] = useState(9);
    const [initSkills, setInitSkills] = useState([]);

    const [remainingFields, setRemainingFields] = useState([]);

    const [allAttributes, setAllAttributes] = useState([]);
    const [allCasterTypes, setAllCasterTypes] = useState([]);
    const [allSpellLists, setAllSpellLists] = useState([]);
    const [allMagicSources, setAllMagicSources] = useState([]);

    const [postJSON, setPostJSON] = useState({});

    // Assemble postJSON whenever any constituënt changes
    useEffect(() => {
        setPostJSON(JSON.stringify(assemblePostJSON()));
    }, [name, baseClass, isPrestige, maxLevel, classFeatures, inheritedClassFeatures, filteredInheritedClassFeatures, hitDie, bab, fortitude, reflex, will, skillsPerLevel, classSkills, casterType, castingStat, magicSource, spellList, spellsPerDay, spellsKnown])
    
    function assemblePostJSON ()
    {
        let tempJSON = {};

        tempJSON.className = name;

        // Check if baseClass is an empty object
        if( JSON.stringify(baseClass).length > 2 )
        {
            tempJSON.archetype = baseClass;
        }

        tempJSON.isPrestige = isPrestige;
        tempJSON.classFeatures = filteredInheritedClassFeatures.concat(classFeatures);
        tempJSON.hitDie = hitDie;
        // Make sure to truncate certain values based on maxLevel
        tempJSON.bab = csvTruncate(bab, 0, maxLevel - 1);
        tempJSON.fortitude = csvTruncate(saveProgression(fortitude), 0, maxLevel - 1);
        tempJSON.reflex = csvTruncate(saveProgression(reflex), 0, maxLevel - 1);
        tempJSON.will = csvTruncate(saveProgression(will), 0, maxLevel - 1);
        tempJSON.skillRanks = skillsPerLevel;
        tempJSON.classSkills = classSkills;

        if ( isSpellcaster === true )
        {
            tempJSON.spellcasterType = casterType;
            tempJSON.castingAbility = castingStat;
            tempJSON.magicSource = magicSource;
            tempJSON.spellList = spellList;
            tempJSON.spellsPerDay = spellsPerDayString;
            tempJSON.spellsKnown = spellsKnownString;
        }

        console.log(tempJSON)

        return tempJSON;

    }

    // Whenever postJSON changes, propagate it
    useEffect(() => {
        props.jsonUpdate(postJSON, "http://localhost:8080/class/allClasses");
    }, [postJSON])

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

        // Only run if this is not beïng triggered by a new base class beïng loaded

        if ( isSpellcaster && baseClass.className === undefined )
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

        // Only set the spellcasting stats if the class is a spellcaster and an archetype
        if ( isSpellcaster == true && baseClass.className !== undefined )
        {
            document.getElementById("castingStat").value = baseClass.castingAbility.attributeID;
            document.getElementById("spellcasterType").value = baseClass.spellcasterType.spellcasterTypeID;
            document.getElementById("spellList").value = baseClass.spellList.spellListID;
            document.getElementById("magicSource").value = baseClass.magicSource.magicSourceID;
            document.getElementById("spellsPerDay").value = spellsPerDayStringToJSON(baseClass.spellsPerDay).table;
            // Parse spells known
            document.getElementById("spellsKnownCategory").value = spellsKnownStringToJSON(baseClass.spellsKnown).category;
        }

    }, [isSpellcaster])

    function setSpellsKnownVal()
    {
        document.getElementById("spellsKnown").value = spellsKnownStringToJSON(baseClass.spellsKnown).table;


        // If this is not derived from a base class, add spellsKnown to remainingFields
        if ( baseClass.className === undefined )
        {
            let tempArray = [];
            tempArray.push(document.getElementById("spellsKnown"));
        
            setRemainingFields([...remainingFields.concat(tempArray)]);
        }
    }

    function parentClassNameNeeded ( field )
    {
        if ( !field.parentNode.className.includes("stillNeeded"))
        {
            field.parentNode.className += " stillNeeded";
        }
    }

    // Change the class of remainingFields' parent so they can be styled differently
    useEffect(() => {

        remainingFields.forEach(field => (
            parentClassNameNeeded( field )
        ));
    }, [remainingFields])

    function removeRemainingFields ( fields )
    {
        fields.forEach ( field => {
            if ( remainingFields.includes(field) )
            {
                field.parentNode.className = field.parentNode.className.substring(
                    0, field.parentNode.className.length - 12
                );
        }})

        setRemainingFields( [...remainingFields.filter( remField => !fields.includes(remField) )]);
    }

    function nameChange ( event )
    {
        setName(event.target.value);

        // If it is a valid name, remove name from remaining fields, otherwise ensure that it's there
        if ( nameValidation( event.target.value ) )
        {
            removeRemainingFields([event.target])
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
            removeRemainingFields([event.target])
        }
    }

    // Take a csv, a start index and an end index and return a csv containing only those elements
    function csvTruncate ( csv, start, end )
    {
        let csvArr = csv.split(',');

        let output = "";

        for ( let i = start; i <= end; ++i )
        {
            // Check that csvArr[i] exists before adding it to output
            if ( csvArr[i] !== undefined )
            {
                output += csvArr[i] + ",";
            }
        }

        // Remove the final comma
        output = output.substring(0, output.length - 1);
        return output;
    }

    function babSelected ( event )
    {
        // If BAB is unselected, clear CSV
        // Otherwise create a CSV corresponding to the three BAB progressions
        let newBAB = ""
        if ( event.target.value === "placeholder" )
        {
            // This is an invalid value so make sure it is represented in remainingFields
            if ( !remainingFields.includes( event.target ))
            {
                setRemainingFields( remainingFields.concat( event.target ) );
            }
        }
        else if ( event.target.value === "half")
        {
            newBAB = "0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10";

            // This is a valid value so remove from remainingFields
            removeRemainingFields([event.target])
        }
        else if ( event.target.value === "twothirds")
        {
            newBAB = "0,1,2,3,3,4,5,6,6,7,8,9,9,10,11,12,12,13,14,15";

            // This is a valid value so remove from remainingFields
            removeRemainingFields([event.target])
        }
        else if ( event.target.value === "one")
        {
            newBAB = "1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20";

            // This is a valid value so remove from remainingFields
            removeRemainingFields([event.target])
        }

        setBab(newBAB);
    }

    // Convert a rate into a JSON for save progressions
    function saveProgression ( rate )
    {
        if ( rate === "good" )
        {
            // Have different progressions based on whether this is a prestige class
            if ( isPrestige === false )
            {
                return "2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12";
            }
            else
            {
                return "1,1,2,2,3,3,4,4,5,5";
            }
        }
        else if ( rate === "poor" )
        {
            // Have different progressions based on whether this is a prestige class
            if ( isPrestige === false )
            {
                return "0,0,1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6";
            }
            else
            {
                return "0,1,1,1,2,2,2,3,3,3";
            }
        }
        else
        {
            return "";
        }
    }

    function fortSelected ( event )
    {
        // Set fortitude based on the two save progressions
        setFortitude(event.target.value);

        if( event.target.value != "placeholder" )
        {
            // This is a valid value so remove from remainingFields
            removeRemainingFields([event.target])
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
        setReflex( event.target.value );

        if( event.target.value != "placeholder" )
        {
            // This is a valid value so remove from remainingFields
            removeRemainingFields([event.target])
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
        setWill( event.target.value );

        if( event.target.value != "placeholder" )
        {
            // This is a valid value so remove from remainingFields
            removeRemainingFields([event.target])
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
            removeRemainingFields([event.target])
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
            removeRemainingFields([event.target])
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
            removeRemainingFields([event.target])
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
            removeRemainingFields([event.target])
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

    // If spellsPerDay changes, update spellsPerDayString
    useEffect(() => {
        if( Object.keys(spellsPerDay).length > 0 )
        {
            // Store the temporary spellsPerDay value and build it up
            let tempSPD = "";

            for ( let level = 1; level <= maxLevel; ++level )
            {
                const levelObj = spellsPerDay["table"];
                
                for ( let spellLevel = 1; spellLevel <= maxSpellLevel; ++spellLevel )
                {
                    let currVal = levelObj[level.toString()][spellLevel.toString()];

                    // If currVal is empty or null, replace it with -
                    if ( currVal === "" || currVal === null )
                    {
                        currVal = "-";
                    }

                    tempSPD += currVal + ',';
                }

                // Remove the trailing comma and replace it with a semicolon
                tempSPD = tempSPD.substring(0, tempSPD.length - 1);
                tempSPD += ";";
            }

            // Remove the last semicolon
            tempSPD = tempSPD.substring(0, tempSPD.length - 1);
            setSpellsPerDayString(tempSPD);
        }
        else
        {
            setSpellsPerDayString(null);
        }
    }, [spellsPerDay])

    function spellsPerDayChanged ( input )
    {
        setSpellsPerDay({...input});

        if ( validSpells( input["table"] ) )
        {
            // This is a valid value so remove from remainingFields
            removeRemainingFields([document.getElementById("spellsPerDay")]);
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

    // If spellsKnown changes, update spellsKnownString
    useEffect(() => {
        if( Object.keys(spellsKnown).length > 0 )
        {
            // Store the temporary spellsKnown value and build it up
            let tempSK = "";

            tempSK += spellsKnown["category"] + ";";

            if ( spellsKnown["category"] === "perLevel" )
            {
                tempSK += spellsKnown.value;
            }
            else if ( spellsKnown["category"] === "complex")
            {
                for ( let level = 1; level <= maxLevel; ++level )
                {
                    for ( let spellLevel = minSpellsKnownLevel; spellLevel <= maxSpellLevel; ++spellLevel )
                    {
                        let currVal = spellsKnown["table"][level.toString()][spellLevel.toString()];

                        // If currVal is empty or null, replace it with -
                        if ( currVal === "" || typeof(currVal) === "undefined" )
                        {
                            currVal = "-";
                        }

                        tempSK += currVal + ',';
                    }

                    // Remove the trailing comma and replace it with a semicolon
                    tempSK = tempSK.substring(0, tempSK.length - 1 ) + ";";
                }
            
                // Remove the last semicolon
                tempSK = tempSK.substring(0, tempSK.length - 1);
            }
            
            setSpellsKnownString(tempSK);
        }
        else
        {
            setSpellsKnownString(null);
        }
    }, [spellsKnown])

    function spellsKnownChanged ( input )
    {
        if ( validSpells( input["table"] ) )
        {
            // This is a valid value so remove from remainingFields
            removeRemainingFields([document.getElementById("spellsKnown")]);
        }
        else
        {
            // This is an invalid value so make sure it is represented in remainingFields
            if ( !remainingFields.includes( document.getElementById("spellsKnown") ))
            {
                setRemainingFields( remainingFields.concat( document.getElementById("spellsKnown") ) );
            }
        }

        setSpellsKnown({...input});
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
            removeRemainingFields([event.target])
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
            removeRemainingFields([document.getElementById("classSkills")])
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
        let skJSON = {}
        skJSON.category = event.target.value;

        if ( event.target.value === "placeholder" )
        {
            skJSON.category = null;
        }
        else if ( event.target.value === "unlimited" )
        {
            
        }
        else if ( event.target.value === "perLevel" )
        {
            skJSON.value = null;
        }
        else if ( event.target.value === "complex" )
        {
            skJSON = spellsKnownStringToJSON("complex;" + generateEmptySpellString());
        }
        else
        {
            skJSON.category = null;
        }

        setSpellsKnown(skJSON);
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

    function generateEmptySpellString ()
    {
        let emptySpellString = "";

        for ( let classLevel = 1; classLevel <= maxLevel + 1; ++classLevel )
        {
            for ( let spellLevel = minSpellsKnownLevel; spellLevel <= maxSpellLevel; ++spellLevel )
            {
                emptySpellString += "-,"
            }

            emptySpellString = emptySpellString.substring(0, emptySpellString.length - 1) + ";";
        }
        emptySpellString = emptySpellString.substring(0, emptySpellString.length - 1)

        return emptySpellString;
    }

    function spellsPerDayStringToJSON ( spdString )
    {
        // Break spdString into a JSON, breaking at semicola
        const spdByClassLevel = spdString.split(";");

        let spdJSON = {};

        for ( let classLevel = 1; classLevel <= maxLevel; ++classLevel )
        {
            let innerJSON = {};


            // Break classLevel down into individual spell levels, breaking at commata
            const spdBySpellLevel = spdByClassLevel[classLevel - 1].split(",");

            for ( let spellLevel = 1; spellLevel <= maxSpellLevel; ++spellLevel )
            {
                // If spdBySpellLevel[spellLevel] is NaN, empty or null, set innerJSON at that point to be -
                // Otherwise, set it to be equal to spdBySpellLevel[spellLevel]
                if ( isNaN(parseInt(spdBySpellLevel[ spellLevel - 1 ])) || spdBySpellLevel[ spellLevel - 1 ] === "" || typeof(spdBySpellLevel[ spellLevel - 1 ]) === null )
                {
                    innerJSON[ spellLevel.toString() ] = "-";
                }
                else
                {
                    innerJSON[ spellLevel.toString() ] = spdBySpellLevel[ spellLevel - 1 ];
                }
            }

            // Add innerJSON to spdJSON
            spdJSON[ classLevel.toString() ] = innerJSON;
        }

        // Return SpellsPerDay in the correct format
        return({"table": spdJSON});
    }

    function loadSpellsPerDayString ( spdString )
    {
        // Set the spellsPerDayString
        setSpellsPerDayString( spdString );

        // Set SpellsPerDay in the correct format
        const spellsPerDayJSON = spellsPerDayStringToJSON( spdString );
        setSpellsPerDay( spellsPerDayJSON );
    }

    function spellsKnownStringToJSON ( skString )
    {
        // Break spdString into a JSON, breaking at semicola
        const skByClassLevel = skString.split(";");
        
        let skJSON = {};
        const skCategory = skByClassLevel[0];

        for ( let classLevel = 1; classLevel <= maxLevel; ++classLevel )
        {
            let innerJSON = {};

            // Break classLevel down into individual spell levels, breaking at commata
            const skBySpellLevel = skByClassLevel[classLevel].split(",");

            for ( let spellLevel = minSpellsKnownLevel; spellLevel <= maxSpellLevel; ++spellLevel )
            {
                // If spdBySpellLevel[spellLevel - 1] is NaN, empty or null, set innerJSON at that point to be null
                // Otherwise, set it to be equal to spdBySpellLevel[spellLevel]
                if ( isNaN(parseInt(skBySpellLevel[ spellLevel - minSpellsKnownLevel ])) || skBySpellLevel[ spellLevel - minSpellsKnownLevel ] === "" || typeof(skBySpellLevel[ spellLevel - minSpellsKnownLevel ]) === null )
                {
                    innerJSON[ spellLevel.toString() ] = "-";
                }
                else
                {
                    innerJSON[ spellLevel.toString() ] = skBySpellLevel[ spellLevel - minSpellsKnownLevel ];
                }
            }

            // Add innerJSON to spdJSON
            skJSON[ classLevel.toString() ] = innerJSON;
        }

        // Return the JSON in the correct format
        return({"category": skCategory, "table": skJSON});
    }

    function loadSpellsKnownString ( skString )
    {
        setSpellsKnownString( skString );
        const skJSON = spellsKnownStringToJSON(skString);
        setSpellsKnown( skJSON );
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
            setInheritedClassFeatures( stripClassIDFromClassFeatures(baseClass.classFeatures) );


            // Check to see if one of the spellcasting stats is null to determine whether this is a spellcasting class
            if ( baseClass.castingAbility === null )
            {
                setIsSpellcaster( false );
            }
            else
            {
                setIsSpellcaster( true );
                setCastingStat( baseClass.castingAbility );
                setCasterType( baseClass.spellcasterType );
                setSpellList( baseClass.spellList );
                setMagicSource( baseClass.magicSource );
                loadSpellsPerDayString( baseClass.spellsPerDay );
                loadSpellsKnownString( baseClass.spellsKnown );
            }
            setSkillsPerLevel( baseClass.skillRanks );
            setClassSkills( stripClassIDFromSkills(baseClass.classSkills) );
        }
        else
        {
            setIsPrestige( false );
            setHitDie( 0 );
            setBab( "" );
            setFortitude( "" );
            setReflex( "" );
            setWill( "" );
            setClassFeatures( [] );
            setIsSpellcaster( false );
            setCastingStat( {} );
            setCasterType( {} );
            setSpellList( {} );
            setMagicSource( {} );
            loadSpellsPerDayString( generateEmptySpellString() );
            loadSpellsKnownString( generateEmptySpellString() );
            setSkillsPerLevel( 0 );
            setClassSkills( [] );
        }

        // Then update the displayed information
        updateBaseClass();

    }, [baseClass])

    // Strip out the previous classID from inherited buffs
    function stripClassIDFromClassFeatures ( classFeatureArray )
    {
        let strippedClassFeatures = [...classFeatureArray];
        strippedClassFeatures.forEach( feature => {
            delete feature.id.classID;
        });

        return strippedClassFeatures;
    }

    // Strip out the previous classID from inherited skills
    function stripClassIDFromSkills ( skillArray )
    {
        let strippedSkills = [...skillArray];
        strippedSkills.forEach( skill => {
            delete skill.id.classID;
        });

        return strippedSkills;
    }


    // Convert a BAB CSV into a description
    function babCSVToDesc ( input )
    {
        if ( typeof(input) !== "string" )
        {
            return "placeholder";
        }
        else if ( input[4] == 3 )
        {
            return "one";
        }
        else if ( input[4] == 2 )
        {
            return "twothirds";
        }
        else if ( input[4] == 1 )
        {
            return "half";
        }
        else 
        {
            return "placeholder";
        }
        
    }

    // Convert a save JSON into a description
    function saveCSVToDesc ( input )
    {
        if ( typeof(input) !== "string" )
        {
            return "placeholder";
        }
        else if ( input.length === 0 )
        {
            return "placeholder";
        }
        else if ( input[0] == 2 )
        {
            return "good";
        }
        else if ( input[0] == 0 )
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
            document.getElementById("babRate").value = babCSVToDesc(baseClass.bab);
            document.getElementById("fortRate").value = saveCSVToDesc(baseClass.fortitude);
            document.getElementById("refRate").value = saveCSVToDesc(baseClass.reflex);
            document.getElementById("willRate").value = saveCSVToDesc(baseClass.will);
            
            // Check to see if one of the spellcasting stats is null to determine whether this is a spellcasting class
            if ( baseClass.castingAbility === null )
            {
                document.getElementById("isSpellcaster").value = false;
                document.getElementById("isSpellcaster").checked = false;
            }
            else
            {
                document.getElementById("isSpellcaster").value = true;
                document.getElementById("isSpellcaster").checked = true;
            }


            document.getElementById("skillRanks").value = baseClass.skillRanks;
            setInitSkills(baseClass.classSkills);

            // The base class should have all fields except name already validated
            removeRemainingFields(remainingFields.filter( field => field.id !== "name" ));
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
            setInitSkills([]);
        }
    }

    function updateSelectedClassFeatures ( classFeatureArray )
    {
        setClassFeatures( classFeatureArray );
    }

    function alterInheritedClassFeatures ( classFeatureArray )
    {
        setFilteredInheritedClassFeatures( classFeatureArray );
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
                <tr>
                    <td className="classTableTitle" colSpan="3">New Class</td>
                </tr>
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
                                        <ClassSelector classSelected={baseClassSelected}/>
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
                                        <ClassFeatureList inheritedClassFeatures={inheritedClassFeatures} update={alterInheritedClassFeatures} />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan={6}>
                                        <ClassFeatureSelector update={updateSelectedClassFeatures}/>
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
                                                    <td><SpellsPerDayTable id="spellsPerDay" minSpellLevel="1" maxSpellLevel={maxSpellLevel} maxLevel={maxLevel} spellsPerDay={spellsPerDay} change={spellsPerDayChanged}/></td>
                                                    <td><SpellKnownTable id="spellsKnown" minSpellLevel={minSpellsKnownLevel} maxSpellLevel={maxSpellLevel} maxLevel={maxLevel} spellsKnown={spellsKnown} setVal={setSpellsKnownVal} change={spellsKnownChanged} /> </td>
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
                                        <SkillSelector id="classSkills" classSkillsSelected={classSkillsSelected} init={initSkills}/>
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