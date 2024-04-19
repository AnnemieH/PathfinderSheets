import { useEffect, useState } from "react"

export default function BuffSelectorItem ( props )
{
    const [buff, setBuff] = useState({});

    useEffect(() => {
        setBuff(props.buff);
    }, [props.buff])

    function hoverStart( event )
    {
        event.target.className += " hovering";
    }

    function hoverEnd( event )
    {
        event.target.className = "buffItem ";
    }

    function selectBuff( event )
    {
        props.selectBuff ( buff, true )
    }

    return (
        <tr key={buff.buffID} className={"buffItem "} onMouseEnter={hoverStart} onMouseLeave={hoverEnd} onClick={selectBuff}>
            <td key={buff.buffID + "cell"}>
                {buff.buffName}
            </td>
        </tr>
    )
}