import Tweet from "components/Tweet";
import { dbAddDoc, dbCollection, dbOrderBy, dbQuery, dbService, rtOnSnapshot } from "fbConfig";
import React, { useEffect, useRef, useState } from "react";

const Home = ({ userObj }) => {
    const [tweet, setTweet] = useState("");
    const [tweetList, setTweetList] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const imageInput = useRef();

    useEffect(() => {
        const q = dbQuery(
            dbCollection(dbService, "tweets"),
            dbOrderBy("createdAt", "desc")
        );
        rtOnSnapshot(q, (snapshot) => {
            const tweetArr = snapshot.docs.map((document) => ({
                id: document.id,
                ...document.data(),
            }));
            setTweetList(tweetArr);
        });
    }, []);

    const onImageChange = (event) => {
        const {target : {files}} = event; // files : file list
        if(files.length > 1){
            window.alert("한 개의 사진만 선택하세요.");
            return;
        }else if(files.length === 0){
            return; // No image selected.
        }
        // Here : One Image File is Successfully Selected.
        const image = files[0];
        const fileReader = new FileReader();
        fileReader.onloadend = (fEvent) => {
            setImagePreview(fEvent.currentTarget.result);
        };
        fileReader.readAsDataURL(image);
    };

    return <div>
        <form onSubmit={async (e) =>{
            e.preventDefault();
            try{
                await dbAddDoc(dbCollection(dbService, "tweets"), {
                    text: tweet,
                    createdAt: Date.now(),
                    author_uid: userObj.uid,
                });
                setTweet("");
            } catch(error) {
                console.log(error);
            }
        }}>
            <input type="text" placeholder="Type your thought!" maxLength={100}
                   value={tweet} onChange={(e) => setTweet(e.target.value)}/>
            <input type="file" accept="image/*" ref={imageInput} onChange={onImageChange} />
            {imagePreview && <div>
                <img src={imagePreview} width="50px" height="50px" alt="preview" /> 
                <button onClick={() => {
                    setImagePreview(null);
                    imageInput.current.value = "";
                }}>Clear Photo</button>
            </div>}
            <input type="submit" value="create" />
        </form>
        <div>
            {tweetList.map(tweet => <Tweet tweet={tweet} key={tweet.id} isAuthor={tweet.author_uid === userObj.uid} />)}
        </div>
    </div>
};
export default Home;