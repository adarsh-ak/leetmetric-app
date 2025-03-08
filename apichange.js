document.addEventListener("DOMContentLoaded",function(){
    // fetching the data into variables from the html
    const searchButton=document.getElementById("search-btn");
    const usernameInput=document.getElementById("user-input");
    const statsContainer=document.querySelector(".stats-container");
    const easyProgressCircle=document.querySelector(".easy-progress");
    const mediumProgressCircle=document.querySelector(".medium-progress");
    const hardProgressCircle=document.querySelector(".hard-progress");
    const easyLabel=document.getElementById("easy-label");
    const mediumLabel=document.getElementById("medium-label");
    const hardLabel=document.getElementById("hard-label");
    const cardStatsContainer=document.querySelector(".stats-cards");

    // return true or false based on a regex
    function validateUsername(username){
        if(username.trim()===""){
            alert("Username should not be empty");
            return false;
        }
        const regex = /^(?!_)(?!.*__)(?!.*_$)[a-zA-Z0-9_]{5,20}$/;
        // const regex=/^[a-zA-Z0-9_-]{1,15}$/;
        const isMatching=regex.test(username);
        if(!isMatching){
            alert("Invalid username");
        }
        return isMatching;
    }

    async function fetchUserDetails(username){
        // const url='https://leetcode-stats-api.herokuapp.com/${username}'
        // const url='https://leetcode.com/graphql';
        const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try{
            searchButton.textContent="Searching...";
            searchButton.disabled=true;

            const response=await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch the user details");
            }
            const parseddata= await response.json();
            console.log("Loggin data: ",parseddata);

            displayUserData(parseddata);
        }
        catch(error){
            statsContainer.innerHTML=`<p>No data found</p>`
        }
        finally{
            searchButton.textContent="Search";
            searchButton.disabled=false;
        }
    }

    function updateProgress(solved,total,label,circle){
        const progressDegree=(solved/total)*100;
        circle.style.setProperty("--progress-degree",`${progressDegree}%`);
        label.textContent=`${solved}/${total}`;
    }

    function displayUserData(parseddata){
        const totalQues=parseddata.totalQuestions;
        const totalEasyQues=parseddata.totalEasy;
        const totalMediumQues=parseddata.totalMedium;
        const totalHardQues=parseddata.totalHard;

        const solvedTotalQues=parseddata.totalSolved;
        const solvedTotalEasyQues=parseddata.easySolved;
        const solvedTotalMediumQues=parseddata.mediumSolved;
        const solvedTotalHardQues=parseddata.hardSolved;

        updateProgress(solvedTotalEasyQues,totalEasyQues,easyLabel,easyProgressCircle);
        updateProgress(solvedTotalMediumQues,totalMediumQues,mediumLabel,mediumProgressCircle);
        updateProgress(solvedTotalHardQues,totalHardQues,hardLabel,hardProgressCircle);
    
        
        
    }

    searchButton.addEventListener('click',function(){
        const username=usernameInput.value;
        console.log("login username: ",username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })
})