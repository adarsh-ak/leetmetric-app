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
    const cardStatsContainer=document.querySelector(".stats-card");

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
        // const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
        try{
            searchButton.textContent="Searching...";
            searchButton.disabled=true;

            // if api not work then this
            
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/' 
            const targetUrl = 'https://leetcode.com/graphql/';

            //concatenate the urls:https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql/
            
            const myHeaders = new Headers();
            myHeaders.append("content-type", "application/json");

            const graphql = JSON.stringify({
                query: "\n    query userSessionProgress($username: String!) {\n  allQuestionsCount {\n    difficulty\n    count\n  }\n  matchedUser(username: $username) {\n    submitStats {\n      acSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n      totalSubmissionNum {\n        difficulty\n        count\n        submissions\n      }\n    }\n  }\n}\n    ",
                variables: { "username": `${username}` }
            })
            const requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: graphql,
            };

            const response = await fetch(proxyUrl+targetUrl, requestOptions);
            // const response=await fetch(url);
            if(!response.ok){
                throw new Error("Unable to fetch the user details");
            }
            const parseddata= await response.json();
            console.log("Loggin data: ",parseddata);

            displayUserData(parseddata);
        }
        catch(error){
            // statsContainer.innerHTML=`<p>No data found</p>`
            statsContainer.innerHTML=`<p>${error.message}</p>`
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
        const totalQues=parseddata.data.allQuestionsCount[0].count;
        const totalEasyQues=parseddata.data.allQuestionsCount[1].count;
        const totalMediumQues=parseddata.data.allQuestionsCount[2].count;
        const totalHardQues=parseddata.data.allQuestionsCount[3].count;

        const solvedTotalQues=parseddata.data.matchedUser.submitStats.acSubmissionNum[0].count;
        const solvedTotalEasyQues=parseddata.data.matchedUser.submitStats.acSubmissionNum[1].count;
        const solvedTotalMediumQues=parseddata.data.matchedUser.submitStats.acSubmissionNum[2].count;
        const solvedTotalHardQues=parseddata.data.matchedUser.submitStats.acSubmissionNum[3].count;

        updateProgress(solvedTotalEasyQues,totalEasyQues,easyLabel,easyProgressCircle);
        updateProgress(solvedTotalMediumQues,totalMediumQues,mediumLabel,mediumProgressCircle);
        updateProgress(solvedTotalHardQues,totalHardQues,hardLabel,hardProgressCircle);
    
        const cardData=[
            {label:"Overall Submissions",value:parseddata.data.
                matchedUser.submitStats.totalSubmissionNum[0].submissions},
            {label:"Overall Easy Submissions",value:parseddata.data.
                matchedUser.submitStats.totalSubmissionNum[1].submissions},
            {label:"Overall Medium Submissions",value:parseddata.data.
                matchedUser.submitStats.totalSubmissionNum[2].submissions},
            {label:"Overall Hard Submissions",value:parseddata.data.
                matchedUser.submitStats.totalSubmissionNum[3].submissions}, 
        ];

        console.log("card ka data: ",cardData);

        cardStatsContainer.innerHTML=cardData.map(
            data=>`<div class="card">
                    <h4>${data.label}</h4>
                    <p>${data.value}</p>
                    </div>`
        ).join("")


    }

    searchButton.addEventListener('click',function(){
        const username=usernameInput.value;
        console.log("login username: ",username);
        if(validateUsername(username)){
            fetchUserDetails(username);
        }
    })
})