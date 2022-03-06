var problemList = $('#fetchedList');

// to store all the fetched contests
const allproblem = problemList.children();
console.log(allproblem);

// to track the current selected platform
var current="all";

// Now to change the data displayed according to the platform selected
$('#platformFilter').on('change',function(){

    if(current!==this.value){

        current=this.value;
        problemList.empty();

        // if wanted to render again the contests of all platforms
        if(current === "all"){
            for(let i = 0 ; i < allproblem.length ; i++){
                console.log(allproblem[i]);
                problemList.append(allproblem[i]);
            }
        }else{
            for(let i = 0 ; i < allproblem.length ; i++){
                if(allproblem[i].dataset.topic === current){
                    console.log(allproblem[i]);
                    problemList.append(allproblem[i]);
                }
            }
        }
        // if contest list is empty after the render
        if(problemList.children().length==0){
            problemList.append(`
                <div class="empty-state">
                <div class="empty-state__content animate__animated animate__pulse">
                <div class="empty-state__icon">
                    <img src="/images/search-result-not-found-2130361-1800925.png" alt="no-result-found">
                </div>
                <div class="empty-state__message">No Problems Suggestion available now :(</div>
                <div class="empty-state__help">
                    Start Participating in Contests from 'Contest' section or visit websites from the quick links on right side.
                </div>
                </div>
            </div>`);
        }
        return;
    }
});
