import { useEffect, useState } from "react";

export default function ClassTable( props )
{
    // Create an array to store levels
    const levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const thisClass = props.currClass;
    const [bab, setBab] = useState([]);
    const [fortitude, setFortitude] = useState([]);
    const [reflex, setReflex] = useState([]);
    const [will, setWill] = useState([]);



    // Whenever the class changes, update their fundamental stats

    useEffect(() => {
        setBab(parseJSONByLevels(thisClass.bab));
        setFortitude(parseJSONByLevels(thisClass.fortitude));
        setReflex(parseJSONByLevels(thisClass.reflex));
        setWill(parseJSONByLevels(thisClass.will));

    }, [props]
    )

    // Break an input JSON apart by class levels
    function parseJSONByLevels( inputString )
    { 

        const tempArr = [];
        const tempJSON = JSON.parse(inputString);


        levels.map( level => 
        {
            tempArr.push(tempJSON[level]);
        });

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
                    <tr key={level}>
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