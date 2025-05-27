//Will add 2 EventListener 1.button=Summarize ; 2.button=SaveNotes.
//For textArea(how will be save notes in db) ; Since it is a browser based extension.
// We will be making use of browser's local storage to save the notes.
//if extension is loaded or when extension is loaded if there is any sort of notes 
// saved locally we should load them in textarea.

document.addEventListener('DOMContentLoaded',()=>{ //when document loads
    chrome.storage.local.get(['researchNotes'],function(result){ //getting researchNotes from LocalStorage
        if(result.researchNotes){
            document.getElementById('notes').value = result.researchNotes; //adding researchNotes to the textarea
        }
    });
    document.getElementById('summarizeBtn').addEventListener('click',summarizeText);
    document.getElementById('saveNotesBtn').addEventListener('click',saveNotes);
});
    async function summarizeText(){
        //1.Get the Seletion text in the browser
        //2.Send the Selection to the API i.e Backend API
        //3.the response it get has to display to Response place i.e. right after Save Notes.
        try{
            //[tab] = getting active Tab 
            const[tab] = await chrome.tabs.query({active:true,currentWindow:true}); //getting user active tab whatever user working on.
            //After get active tab supposed to run a script in the active tab because we need the selected text as we going to summarize
            const [{result}] = await chrome.scripting.executeScript({ //getting selected text
                target: {tabId : tab.id}, //passing tab.id here
                function : () => window.getSelection().toString()
            });
            if(!result){ //validation is done i.e use has selected some text
                showResult('Please select some text first');
                return;
            }
            //API calling ; Making use of fetch api which is inbuilt api in browsers
            const response = await fetch('http://localhost:8088/api/research/process',{
                method : 'POST',
                headers : {'Content-Type':'application/json'},
                //2 thing we pass in first 1.content 2.result
                //In content have the result which is selected text that we want to summarize
                //In operation we have to add operation need 'summarize"
                body:JSON.stringify({content: result,operation:'summarize'})
            });
            if(!response.ok){ //if response is not ok
                throw new Error(`API Error:${response.status}`);
            }
            //if there is no error
            const text = await response.text();
            showResult(text.replace(/\n/g,'<br>')); //replace new line character /\n/g that we will get in the response with <br> in HTML
        }catch(error){
            showResult('Error:'+error.message);
        }
    }

    async function saveNotes(){
        const notes = document.getElementById('notes').value; //Whatever in the textarea will get that first
        chrome.storage.local.set({'researchNotes':notes},function(){
            alert('Notes Saved Successfully');
        });
    }

    //will display anything that we pass into result Id
    function showResult(content){
        //we are adding result in 2 div i.e., 1.result-item  2.result-content and adding the content
        document.getElementById('results').innerHTML = `<div class="result-item"><div class="result-content">${content}</div></div>`
    }
