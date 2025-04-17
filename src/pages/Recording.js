import React, { useState, useEffect } from "react";
import { navigate } from "@reach/router";
import { Nav } from "../components/Nav";
import { notion, useNotion } from "../services/notion";

var recorder = 0

export function Recording() {
    const { user } = useNotion();

    const [buttonText, setButtonText] = useState('Start Recording');

    const [participantID, setParticipantID] = useState('');
    const [readingAssessment, setRecordingType] = useState("Empty");
    const [group, setGroup] = useState("Empty");
    const [bd, setBD] = useState("");
    const [notes, setNotes] = useState("");

    const [useableData, setUseableData] = useState('');
    const [focus, setFocus] = useState(0);
    const [focusNumb, setFocusNumb] = useState(0);
    const [focusDisplay, setFocusDisplay] = useState('');
    const [calmNumb, setCalmNumb] = useState(0);

    const [rawData, setRawData] = useState('');
    const [rawNumb, setRawNumb] = useState('');

    const [timeRef, setTimeRef] = useState(0);


    function onSubmit (e){
      e.preventDefault();
      //use form values to create filename. 
      var filename = participantID +"_"+ group +"_"+ bd +"_"+ readingAssessment+".json";
      console.log(filename);

      //make sure we're connected 
      
      const stateSubscription = notion.status().subscribe(status => {
        if (status.state !== 'online' || status.sleepMode) {
          console.log('make sure the neurosity is online');
          recorder=2
          console.log(recorder)
        };
      });
      stateSubscription.unsubscribe();
      console.log(recorder)

      //start recording from Neurosity
      const time = new Date(Date.now());
      setTimeRef(time);

      if (recorder === 1 || buttonText !== 'Start Recording') {
        setTimeRef(timeRef.toString());
        stopRecording();
        setButtonText('Start Recording');
        setFocusDisplay('');
      } else if (recorder === 0) {
        setButtonText('Stop Recording');
      };

      recorder === 0 ? recorder=1 : recorder=0;

      setUseableData([[time,"time", "Focus Score", "Calm Score"], "\n"]);
      var rawDataCol = [time,"raw time"];
      var nodes = ["CP3", "C3","F5", "PO3", "PO4", "F6", "C4", "CP4"];
      for (let i=0; i<8; i++) {
        for (let j=0; j<16;j++) {
          rawDataCol.push(nodes[i]+'_'+String(j));
        }
      }
      setRawData([[rawDataCol],"\n"]);
      
    }

    function handleAdd() {
      setUseableData([...useableData, [Date.now()-timeRef, focusNumb, calmNumb], "\n"]);
      setFocusDisplay(focusDisplay.concat( JSON.stringify(focus)+', ' ));
    }

    function handleAddRaw() {
      setRawData([...rawData, [Date.now()-timeRef, String(rawNumb['data'][0]), String(rawNumb['data'][1]), String(rawNumb['data'][2]), 
      String(rawNumb['data'][3]), String(rawNumb['data'][4]), String(rawNumb['data'][5]), String(rawNumb['data'][6]), 
      String(rawNumb['data'][7])], "\n"]);
    }

    function stopRecording(e){
      // create a csv file and download it 
      const blob = new Blob([useableData], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      var filename = participantID +"_"+ group +"_"+ bd +"_"+ readingAssessment+".csv";
      link.download = filename;
      link.href = url;
      link.click();

      const blobRaw = new Blob([rawData], { type: "text/csv" });
      const urlRaw = URL.createObjectURL(blobRaw);
      const linkRaw = document.createElement("a");
      var filenameraw = participantID +"_"+ group +"_"+ bd +"_"+ readingAssessment+"_raw.csv";
      linkRaw.download = filenameraw;
      linkRaw.href = urlRaw;
      linkRaw.click();
    }

    useEffect(() => {
      if (!user) {
        navigate("/login");
      };
    }, [user]);

    useEffect(() => {
      if (!user) {
        return;
      };

      const subscriptionF = notion.focus().subscribe((focus) => {
        const focusScore = (focus.probability * 100);
        setFocus(Math.trunc(focusScore));
        setFocusNumb(focusScore);
      });

      const subscriptionC = notion.calm().subscribe((calm) => {
        const CalmScore = (calm.probability * 100);
        setCalmNumb(CalmScore);
      });

      const subscriptionR = notion.brainwaves('raw').subscribe((raw) => {
        setRawNumb(raw)
      })
  
      return () => {
        subscriptionF.unsubscribe();
        subscriptionC.unsubscribe();
        subscriptionR.unsubscribe();
      };
    }, [recorder]);

    window.onbeforeunload = function(){
      if (recorder === 1) {
        stopRecording()
      }
    };

    useEffect(() => {
      if (recorder === 0) {
        return;
      }
      handleAdd();
    }, [focusNumb]);

    useEffect(() => {
      if (recorder === 0) {
        return;
      }
      handleAddRaw();
    }, [rawNumb]);

    return (
      <main className="main-container">
        {user ? <Nav /> : null}
        <form className="card login-form" onSubmit={onSubmit}>
        <h3 className="card-heading">Recording Set Up</h3>
        <div className="row">
          <label>Participant ID:</label>
          <input
            type="number"
            value={participantID}
            onChange={(e) => setParticipantID(e.target.value)}
            required
          />
        </div>
        <div className="row">
          <label>Recording Type:</label>
          <select 
            value={readingAssessment} 
            onChange={(e) => setRecordingType(e.target.value)}
            required>
            <option value="empty"></option>
            <option value="baseline">Baseline</option>
            <option value="ra1">Reading Assessment #1</option>
            <option value="ra2">Reading Assessment #2</option>
          </select>
        </div>
        <div className="row">
        <label>Participant Group:</label>
          <select 
          value={group} 
          onChange={(e) => setGroup(e.target.value)}>
            <option value="Empty"></option>
            <option value="NT">Neurotypical</option>
            <option value="mADHD">Medicated ADHD</option>
            <option value="uADHD">Unmedicated ADHD</option>
          </select>
        </div>
        <div className="row">
            <label>Bodydouble: </label>
            <select 
          value={bd} 
          onChange={(e) => setBD(e.target.value)}
          required>
            <option value="Empty"></option>
            <option value="bd0">Absent</option>
            <option value="bd1">Present</option>
          </select>

        </div>
        <label>Notes:</label>
          <textarea 
          value= {notes}
          onChange={(e) => setNotes(e.target.value)}>
          </textarea>

        <div className="row">
          <button type="submit" className="card-btn">{buttonText}
          </button>
        </div>
        <p>{focusDisplay}</p>
      </form>

        <div className="focus-score">
          &nbsp;{focus}% <div className="focus-word">Focus</div>
        </div>
      </main>
    );
}