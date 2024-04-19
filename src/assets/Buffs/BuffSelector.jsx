import { useEffect, useState } from "react"
import BuffSelectorItem from "./BuffSelectorItem";
import SelectedBuffItem from "./SelectedBuffItem";

export default function BuffSelector()
{
    const [allBuffs, setAllBuffs] = useState([]);
    const [filteredBuffs, setFilteredBuffs] = useState([]);
    const [selectedBuffs, setSelectedBuffs] = useState([]);

    useEffect(() => {
        const url = "http://localhost:8080/buff/allBuffs"

        fetch(url)
        .then(res => res.json())
        .then(data => setAllBuffs(data));
    }, [])

    // Add the given buff to selectedBuffs
    function selectBuff ( buff )
    {
        setSelectedBuffs( selectedBuffs.concat( buff ));
    }

    // Remove the buff at the given index
    function removeBuff ( index )
    {
        setSelectedBuffs( selectedBuffs.filter( (elem, i) =>  i != index) );
    }

    // Filter the buff list to only those which contain the text input
    // Irregardless of case
    function filterBuffs( event )
    {
        setFilteredBuffs( allBuffs.filter((buff) =>
        buff.buffName.toLowerCase().includes(event.target.value.toLowerCase())
    ));
    }

    return (
        <table>
            <tbody>
                <tr>
                    <td>
                        <table>
                            <thead>
                                <tr>
                                    <td>
                                        Ability
                                    </td>
                                    <td>
                                        Level
                                    </td>
                                    <td>
                                        
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedBuffs.map((buff, index) => (
                                    <SelectedBuffItem buff={buff} key={buff.buffID + "" + index} removeBuff={removeBuff} index={index}/>
                                ))}
                            </tbody>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <input type="text" onChange={filterBuffs}/>
                    </td>
                </tr>
                {filteredBuffs.map( buff => (
                    <BuffSelectorItem buff={buff} key={buff.buffID + "selector"} selectBuff={selectBuff}/>
                ))}
            </tbody>
        </table>
    )
}