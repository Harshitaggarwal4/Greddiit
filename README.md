# My Implementations:
##    In Login Page,
        I have made username Unique instead of email. 
        After SignUp, the user is just registered on the database, you then need to login throught the signIn page.
        After SignUp, the user will land on a Home Page where there is just a image.

##    In MyProfile,
        The basic information of the current logged in user is shown in the format:
            FirstName SecondName (Username)
            Age
            PhoneNumber
            EmailId
            NumberOfFollowers ViewFollowers
            NumberOfFollowing ViewFollowing

        Then there is a EditProfile Button,
            If any field is left empty, then that field wont be updated in the database.

##    In mySubGreddiit,
        On the Top is there a Create SubGreddiit Button,
            Onclicking it a form will appear with the info about of the Subgreddiit to create:
                Uploading Image is mandatory
                To add Tags, seperate them with commas.
                Same is the process for adding Banned Keywords
            Banned Keywords are also applied on the Description of the subgreddiit
                The banned Keywords if appear will be replaced by *

        Here i am showing the SubGreddiits that are made by the current logged in user.
        The details shown in those SubGreddiit are:
            Title
            Description
            NumberofPeople
            NumberofSubPost
            BannedKeywords
            RemoveSubGreddiit Button
            OpenSubGreddiit Button
        The RemoveSubGreddiit Button will delete the subgreddiit with all its post, reports, join req, stats of that subgreddiit from the mongo DB.

        On Cicking on Open Subgreddiit, that Subgreddit will open with 4 TABS
            1. SubGreddiitUsers : There it is divided into 2 sections,
                                    1. The User that have currently joined the Subgreddit
                                    2. The Users that are blocked from the SubGreddiit
            2. SubGreddiitJoiningReqPage : There all the join request for joining the SubGreddiit are shown with the user info and 2 options
                                           to either Accept Or Reject. Choosing any of the option will remove the req.
                                           Once Rejected the user can again send the joining Req, but at a time only OneReq can be send
            3. SubGreddiitStats : Here the stats that were required in the docs are shown with their respective graphs.
            4. SubGreddiitReortedPage : Here all the reports made on the posts are shown:
                                        For each report, the content of that post is shown with with the report concern.
                                        The name of the user reported and the creater of that post is also shown.
                                        There are 3 button to choose from:
                                        1. Block : A 3 second timer will come on the lable of that button to cancel the block req. To cancel just
                                            click again on the button.
                                            It will remove the user who posted the post from the subgreddiit and that user cannot join
                                            the that subgreddiit again and cant even send a join req (Backend Handling Covered)
                                                After the Delete and Ignore button will be disabled for that report
                                        2. Delete : This will delete that post from that subgreddiit with it will still remain in the savedPost 
                                            of all those user who saved it before getting delete. The report will also get deleted on Clicking
                                            this button. The Block and the Ignore button will be disabled after choosing this option.
                                        3. Ignore : This will just disable the Block and Delete Button from that report.



##    In SubGreddiitPage,
        To open a Subgreddit, click on the title of that subgreddiit
            You can only open the subgreddiit that you are either the moderator or have joined and who never have left or blocked from that subgreddiit.

        Here i am showing all the SubGreddiit that are present on the platform in 5 sections:
            1st section : The Subgreddiit that the current user is the moderator
                It consist of 1 leave Button which is DISABLED

            2st section : The Subgreddiit that the current user has joined and is not the moderator
                It consist of 1 leave Button 

            3st section : The Subgreddiit that the current user can join
                It consist of 1 join Button 

            4st section : The Subgreddiit that the cuurent user have left once and hence cannot join again
                It consist of 1 join Button which is DISABLED with lable OnceLeft

            5st section : The Subgreddiit that the cuurent is blocked from and hence cannot join again.
                It consist of 1 join Button which is DISABLED with lable Blocked

        The information of each Subgreddit is shown in the format:
            Image that the LeftSide of the CARD
            Title
            Description
            NumberofPeople
            NumberofSubPost
            BannedKeywords
        
        On Opening a Subgreddiit, the left side of the page will be showing the details of the current SubGreddiit
        with a create SubPost button which will open a modal to create a Post inside that Subgreddiit.
            I have Implemented Report with Report Concern, SaveForLater, Upvote, Downvote, Follow, Postedby, Comment
            That Posted By will show BLOCKED USER if the creater of that post is blocked by the moderator.

            MyImplementation in Upvote and DownVote, 
                Initially the user has not upvote or downvote.
                Once any of 2 option is clicked that will disappear that the option button will remain.
                On clicking the other button then then the first button wil reappear and the second button wil disappead like toggling.
                    i.e. A user can do either 1 UpVote or 1 DownVote.

        On the Top of the page, Fuzzy Search is implemeted that if the text mention in the search bar appears in any
        title of any subgreddiit then all those subgreddiit will be shown.

        There are also button for Ascending, Decending (Based on the Title), Followers (Based on number of people who have join the post),
        Date (Date of creation of the Post).


##    In SavedPost,
        Here all the Post inside all the subgreddiit that the user have saved are shown.
        The details are shown in the following format:
            First its show that Image, Title, Description of the Subgreddiit that that saved Post belong to.
            Then the saved Post is shown with a button to remove it from the saved post, number of upvotes, number of downvotes
            and the content of that post.
    
##    In Chat,
        Here you will be shown the list of people whom you are following and there are also following you,
            On clicking the button Start Chat, you can chat with that user.
