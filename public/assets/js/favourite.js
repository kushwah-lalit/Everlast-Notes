var problemList=$("#fetchedList");const allproblem=problemList.children();console.log(allproblem);var current="all";function sortByDate(){let e=problemList.children(),t=e.length;for(;t--;)problemList.append(e[t])}function toggleAndRemove(e){$.ajax({type:"get",url:e,success:function(e){$(`#${e.data.problem_id}`).remove(),0==problemList.children().length&&problemList.append('\n                    <div class="empty-state">\n                    <div class="empty-state__content animate__animated animate__pulse">\n                    <div class="empty-state__icon">\n                        <img src="/images/search-result-not-found-2130361-1800925.png" alt="no-result-found">\n                    </div>\n                    <div class="empty-state__message">No Problems marked as favourite.</div>\n                    <div class="empty-state__help">\n                        Starting adding your favourite problems from Problems section to Favourites.\n                    </div>\n                    </div>\n                </div>')},error:function(e){console.log(e.responseText)}})}$("#platformFilter").on("change",function(){if(current===this.value);else{if(current=this.value,problemList.empty(),"all"===current)for(let e=0;e<allproblem.length;e++)console.log(allproblem[e]),problemList.append(allproblem[e]);else for(let e=0;e<allproblem.length;e++)allproblem[e].dataset.topic===current&&(console.log(allproblem[e]),problemList.append(allproblem[e]));0==problemList.children().length&&problemList.append('\n                <div class="empty-state">\n                <div class="empty-state__content animate__animated animate__pulse">\n                <div class="empty-state__icon">\n                    <img src="/images/search-result-not-found-2130361-1800925.png" alt="no-result-found">\n                </div>\n                <div class="empty-state__message">No Problems marked as favourite.</div>\n                <div class="empty-state__help">\n                    Starting adding your favourite problems from Problems section to Favourites.\n                </div>\n                </div>\n            </div>')}});