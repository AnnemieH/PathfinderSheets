import { TabList, Tabs, Tab, TabPanel } from "react-tabs";
import 'react-tabs/style/react-tabs.css';
import SkillsTab from "./Sheet Tabs/SkillsTab";
import { useEffect, useState } from "react";
import BasicsTab from "./Sheet Tabs/BasicsTab";

// PROPS
// character - an object with two members: raw (where the raw database data is kept untouched unless we want to make database changes); and
//                                         derived (where we can add salient info)
// refresh - a function to refresh the character
export default function CharacterSheet ( props )
{
    const [currentCharacter, setCurrentCharacter] = useState({});
    const [patchURL, setPatchURL] = useState("");
    const [isEditing, setIsEditing] = useState(false);

    // Set all relevant states when props change
    useEffect ( () => {
        setCurrentCharacter(props.character);
    }, [props])

    // Refresh the character
    function refreshCharacter()
    {
        props.refresh();
    }

    // Send patch request whenever given a JSON
    function patchCharacter ( patchJSON )
    {
        const patchURL = "http://localhost:8080/character/" + currentCharacter.raw.characterID;

        const requestOptions =
        {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json-patch+json'},
            body: patchJSON
        };

        console.log(requestOptions);

        fetch(patchURL, requestOptions)
            .then(response => response.json())
            .then(refreshCharacter);
    }

    function editToggle ()
    {
        setIsEditing(!isEditing);
    }

    return (
        <>

        <span id={"EditButton" + isEditing} onClick={editToggle}>
            Edit
        </span>
            <Tabs forceRenderTabPanel>
                <TabList>
                    <Tab>Basics</Tab>
                    <Tab>Skills</Tab>
                    <Tab>Combat</Tab>
                    <Tab>Magic</Tab>
                </TabList>
                <TabPanel>
                    <BasicsTab character={currentCharacter} update={patchCharacter} editMode={isEditing}/>
                </TabPanel>
                <TabPanel>
                    <SkillsTab character={currentCharacter} update={patchCharacter}/>
                </TabPanel>
                <TabPanel>
                    CombatTab                
                </TabPanel>
                <TabPanel>
                    MagicTab
                </TabPanel>
            </Tabs>
        </>
    );
}