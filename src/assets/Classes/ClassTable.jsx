import { useEffect, useState } from "react";

export default function ClassTable( props )
{
    // Create an array to store levels
    const [levels, setLevels] = useState([]);
    const thisClass = props.currClass;
    const [maxLevel, setMaxLevel] = useState(20);
    const [bab, setBab] = useState([]);
    const [fortitude, setFortitude] = useState([]);
    const [reflex, setReflex] = useState([]);
    const [will, setWill] = useState([]);


    // Whenever the class changes, update their fundamental stats

    useEffect(() => {
        setMaxLevel( parseStringByLevels(thisClass.bab).length )
        setBab(parseStringByLevels(thisClass.bab));
        setFortitude(parseStringByLevels(thisClass.fortitude));
        setReflex(parseStringByLevels(thisClass.reflex));
        setWill(parseStringByLevels(thisClass.will));

    }, [props]
    )

    useEffect( () => {
        let tempArr = [];

        for ( let i = 1; i <= maxLevel; ++i )
        {
            tempArr.push(i);
        }

        setLevels( tempArr );
    }, [maxLevel])

    // Break an input JSON apart by class levels
    function parseStringByLevels( inputString )
    { 

        const tempArr = inputString.split(',');

        return tempArr;

    }

    // If BAB is 6 or higher, give extra attacks
    function babCalculator( maxBAB )
    {
        let outputString = "+" + maxBAB;
        for ( let i = 1;
            maxBAB - (5 * i) >= 1;
            ++i )
            {
                let nextBAB = maxBAB - (5 * i);
                outputString += "/+" + nextBAB;
            }

        return outputString;
    }

    return (
        <table>
            <thead>
                <tr>
                    <td>Level</td>
                    <td>BAB</td>
                    <td>Fortitude</td>
                    <td>Reflex</td>
                    <td>Will</td>
                    <td>Abilities</td>
                </tr>
            </thead>
            <tbody>
                {levels.map( level => (
                    <tr key={thisClass.classID + level}>
                        <td>{level}</td>
                        <td>{babCalculator(bab[level - 1])}</td>
                        <td>{fortitude[level - 1]}</td>
                        <td>{reflex[level - 1]}</td>
                        <td>{will[level - 1]}</td>
                        <td>{thisClass.buffs.map( buff => (
                            buff.id.level == level &&
                            <span key = {buff.id.buffID} className="tooltip">{buff.buff.buffName} 
                                <span key={"tooltip" + buff.id.buffID} className="tooltipText">
                                    {buff.buff.buffDescription}
                                </span>
                            </span>
                        ))}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )
}