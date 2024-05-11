import { TabList, Tabs, Tab, TabPanel } from "react-tabs";
import 'react-tabs/style/react-tabs.css';
import SkillsTab from "./Sheet Tabs/SkillsTab";
import { useEffect, useState } from "react";
import BasicsTab from "./Sheet Tabs/BasicsTab";

export default function CharacterSheet ( props )
{
    const [currentCharacter, setCurrentCharacter] = useState({});
    const [patchURL, setPatchURL] = useState("");

    // Set all relevant states when props change
    useEffect ( () => {
        setCurrentCharacter(props.character);
    }, [props])

    // Refresh the character
    function refreshCharacter()
    {
        const url = "http://localhost:8080/character/" + currentCharacter.characterID;

        fetch(url)
        .then( res => res.json() )
        .then( data => setCurrentCharacter(data) );
    }

    // Send patch request whenever given a JSON
    function patchCharacter ( patchJSON )
    {
        const patchURL = "http://localhost:8080/character/" + currentCharacter.characterID;

        const requestOptions =
        {
            method: 'PATCH',
            headers: {'Content-Type': 'application/json-patch+json'},
            body: patchJSON
        };

        console.log(requestOptions);

        fetch(patchURL, requestOptions)
            .then(response => response.json());

        refreshCharacter();
    }

    return (
        <Tabs forceRenderTabPanel>
            <TabList>
                <Tab>Basics</Tab>
                <Tab>Skills</Tab>
                <Tab>Combat</Tab>
                <Tab>Magic</Tab>
            </TabList>
            <TabPanel>
                <BasicsTab character={currentCharacter} update={patchCharacter}/>
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
    );
}