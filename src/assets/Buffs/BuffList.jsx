import { useEffect, useState } from "react"

export default function BuffList ( props )
{
    const [displayBuffs, setDisplayBuffs] = useState([]);
    const [finalBuffs, setFinalBuffs] = useState([]);

    // Proopagate finalBuffs whenever it changes
    useEffect ( () => {
        props.update(finalBuffs)
    }, [finalBuffs])

    // If props.displayBuffs changes, change the internal state to match it or to be an empty array.
    useEffect(() =>{
        if (Array.isArray(props.inheritedBuffs))
        {
            // Sort displayBuffs by level
            setDisplayBuffs(props.inheritedBuffs.sort((a, b) => a.id.level - b.id.level));
        }
        else
        {
            setDisplayBuffs([]);
        }
    }, [props.inheritedBuffs])

    // Whenever displayBuffs changes, set finalBuffs to be equal
    useEffect(() => {
        setFinalBuffs(displayBuffs);
    }, [displayBuffs])

    function cancelBuff( event )
    {
        // Separate out the buffID and buffLevel from the className
        const buffID = event.target.className.split(" ")[0]
        const buffLevel = event.target.className.split(" ")[1]

        // Get the unique buff corresponding to the given ID and level
        const buff = displayBuffs.filter( elem => (
            elem.id.buffID == buffID &&
            elem.id.level == buffLevel
        ))[0];

        // If present, remove this buff from finalBuffs and strike it through
        if ( finalBuffs.includes(buff) )
        {
            setFinalBuffs(finalBuffs.filter( elem => elem != buff));
            event.target.parentNode.className = "strike"
        }
        // Otherwise put it back
        else
        {
            setFinalBuffs( finalBuffs.concat(buff));
            event.target.parentNode.className = ""
        }
    }

    return (
        <table id="buffList">
            <thead>
                <tr>
                    <td>Class ability</td>
                    <td>Level learned</td>
                </tr>
            </thead>
            <tbody>
            {displayBuffs.map(buff => (
                <tr key={buff.buff.buffID + "" + buff.id.level} id={buff.buff.buffID + "" + buff.id.level}>
                    <td key={buff.buff.buffID + "" + buff.id.level + "name"}>
                        {buff.buff.buffName} 
                    </td>
                    <td key={buff.buff.buffID + "" + buff.id.level + "level"}>
                        {buff.id.level}
                    </td>
                    <td key={buff.buff.buffID + "" + buff.id.level + " cancel"} className={buff.buff.buffID + " " + buff.id.level + " cancel"} onClick={cancelBuff}>
                        X
                    </td>
                </tr>
            ))}
            </tbody>
        </table>
    )
}