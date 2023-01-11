import React, { useState, useEffect } from 'react';
import withStyles from "@material-ui/core/styles/withStyles";
import {
    Card, CardContent, FormControl, FormHelperText,
    InputLabel, MenuItem, Select, Typography
} from "@material-ui/core";
import { callDalleService } from "./backend_api";
import GeneratedImageList from "./GeneratedImageList";
import TextPromptInput from "./TextPromptInput";

import "./App.css";
import BackendUrlInput from "./BackendUrlInput";
import LoadingSpinner from "./LoadingSpinner";
import NotificationCheckbox from './NotificationCheckbox';
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";


const { Configuration, OpenAIApi } = require("openai");

const useStyles = () => ({
    root: {
        display: 'flex',
        width: '100%',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
    },
    title: {
        marginBottom: '20px',
    },
    playgroundSection: {
        display: 'flex',
        flex: 1,
        width: '100%',
        alignItems: 'flex-start',
        justifyContent: 'center',
        marginTop: '20px',
    },
    settingsSection: {
        display: 'flex',
        flexDirection: 'column',
        padding: '1em',
        maxWidth: '300px',
    },
    searchQueryCard: {
        marginBottom: '20px'
    },
    imagesPerQueryControl: {
        marginTop: '20px',
    },
    formControl: {
        margin: "20px",
        minWidth: 120,
    },
    gallery: {
        display: 'flex',
        flex: '1',
        maxWidth: '50%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'flex-start',
        padding: '1rem',
    },
});

const NOTIFICATION_ICON = "https://camo.githubusercontent.com/95d3eed25e464b300d56e93644a26c8236a19e04572cf83a95c9d68f8126be83/68747470733a2f2f656d6f6a6970656469612d75732e73332e6475616c737461636b2e75732d776573742d312e616d617a6f6e6177732e636f6d2f7468756d62732f3234302f6170706c652f3238352f776f6d616e2d6172746973745f31663436392d323030642d31663361382e706e67";

const HomePage = ({ classes }) => {
    const blockchain = useSelector((state) => state.blockchain);
    const dispatch = useDispatch();

    const [backendUrl, setBackendUrl] = useState('');
    const [promptText, setPromptText] = useState('');
    const [isFetchingImgs, setIsFetchingImgs] = useState(false);
    const [isCheckingBackendEndpoint, setIsCheckingBackendEndpoint] = useState(false);
    const [isValidBackendEndpoint, setIsValidBackendEndpoint] = useState(true);
    const [notificationsOn, setNotificationsOn] = useState(false);

    const [generatedImages, setGeneratedImages] = useState([]);
    const [generatedImagesFormat, setGeneratedImagesFormat] = useState('jpeg');

    const [apiError, setApiError] = useState('')
    const [imagesPerQuery, setImagesPerQuery] = useState(2);
    const [queryTime, setQueryTime] = useState(0);

    const imagesPerQueryOptions = 10
    const validBackendUrl = isValidBackendEndpoint && backendUrl

    //for ipfs upload
    const [file, setFile] = useState();

    /*function handleChange(e) {
        console.log(e.target.files);
        setFile(URL.createObjectURL(e.target.files[0]));
    }*/

    const configuration = new Configuration({
        apiKey: process.env.REACT_APP_OPENAI_API_KEY,
      });


    function dataURLToBlob(dataURL) {
        // Split the data URL on comma
        var parts = dataURL.split(',');
      
        // Get the MIME type and the data
        var mime = parts[0].split(':')[1].split(';')[0];
        var data = atob(parts[1]);
      
        // Create a typed array of the data
        var uInt8Array = new Uint8Array(data.length);
        for (var i = 0; i < data.length; i++) {
          uInt8Array[i] = data.charCodeAt(i);
        }
      
        // Return the Blob object
        return new Blob([uInt8Array], {type: mime});
    }

    const sendFileToIPFS = async (e) => {

        //alert(file);
        var imageCreated = "https://oaidalleapiprodscus.blob.core.windows.net/private/org-ieV9su92PrEVCDGzY96d3hVS/user-GV2NtPZ1Qo6WO1ht62aKySlE/img-liHcKhJAvHYJlY8gHasGs8mG.png?st=2023-01-11T17%3A43%3A46Z&se=2023-01-11T19%3A43%3A46Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2023-01-11T17%3A15%3A39Z&ske=2023-01-12T17%3A15%3A39Z&sks=b&skv=2021-08-06&sig=2iluIeLUj9GPTm8rCyfLPLnZssiKqKis4ddbESmlcfo%3D";
        //document.getElementById('imgHome').src;
        console.log(imageCreated);
        if(imageCreated != null)
        {
            alert("Image is Loaded Successfully");
            
           var canVas = document.getElementById('canV');   
            // Draw the image on the canvas
            canVas.width = imageCreated.width;
            canVas.height = imageCreated.height;
            var ctx = canVas.getContext('2d');
            ctx.drawImage(imageCreated,0,0);
            var dataURL = canVas.toDataURL('image/png');

            var blob = dataURLToBlob(dataURL);

            var file = new File([blob], 'my-image111.png', {type: 'image/png'});

           /* const response = await axios({
                method: "GET",
                url: imageCreated,
                mode: "no-cors",
                headers: {
                    "Content-Type": "application/json"
                },
            });
            */
            //console.log(response);
            setFile(file);
            console.log("before file");
            console.log(file);
        }
        
        if (file) {
            try {

                const formData = new FormData();
                formData.append("file", file);
                const resFile = await axios({
                    method: "post",
                    url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                    data: formData,
                    headers: {
                        'pinata_api_key': `eb2c15a1e531012c7577`,
                        'pinata_secret_api_key': `b1f3886893f991268c0cf07912d3b6f0600f409325e765c44e5941956f7a37fb`,
                        "Content-Type": "multipart/form-data"
                    },
                });

                const ImgHash = `https://gateway.pinata.cloud/`+`ipfs/${resFile.data.IpfsHash}`;
                console.log(ImgHash); 
                var xxAddress = "0x376D4aE2Fba5B24984c2ee11B8722CdeB7644382";
	            var gasLimitValue = "885000";
                var payableAmount = 1;
                var _mintAmount = 1;
                var _metadata = "this is my sixth nft";
                var _imageuri = ImgHash;
                payableAmount = blockchain.web3.utils.toWei((payableAmount).toString(), "ether");
                
                if (ImgHash != "")
                {
                    try {
                    blockchain.smartContract.methods
                    .mint( blockchain.account, _mintAmount, _metadata, _imageuri )
                    .send({
                        gasLimit: gasLimitValue,
                        to: xxAddress,
                        from: blockchain.account,
                        value: payableAmount,
                        _mintAmount: _mintAmount,
                        _metadata: _metadata,
                        _imageuri: ImgHash,
                    }).once("error", (err) => {
                        console.log(err);
                    })
                        .then((receipt) => {
                            console.log("Minted successfully");
                            
                            
                            getData();    
                    });
                  
                    
                           
                }catch (error)
                {
                    console.log(error);
                }
                }
//Take a look at your Pinata Pinned section, you will see a new file added to you list.   



            } catch (error) {
                console.log("Error sending File to IPFS: ")
                console.log(error)
            }
        }
    }


//Set the image generated to file
        
var canvas;
    



//image generation using Dell-e
const openai = new OpenAIApi(configuration);

const generateImage = async () => {


    var prompt = 'No value';
    //alert(process.env.REACT_APP_OPENAI_API_KEY);
    if(document.getElementById('textToGenerate')!= null)
    {
        prompt  = document.getElementById('textToGenerate').value;
    
    const size = 'medium';

    //alert(prompt);
    //alert(size);
    const imageSize = size === 'small' ? '256x256' : size === 'medium' ? '512x512' : '1024x1024';

    try{
        const response = await openai.createImage({
            prompt,
            n: 1,
            size: imageSize
        });
        console.log(response);
        const imageUrl = response.data.data[0].url;

        //var img = new Image();
        //img.src = imageUrl;
        //img.id = 'imgHome';
        document.getElementById('imgHome').src = imageUrl;
        
        //setFile(img);
        //document.getElementById('resultImage').src = imageUrl;
        //setFile(document.getElementById('resultImage').value);
        //var data = getBase64Image(document.getElementById('resultImage'));
        //setFile(data);
        /*res.status(200).json({
            success: true,
            data: imageUrl
        })*/
        //alert(imageUrl);

        
        /*
        fetch(imageUrl, { mode: 'no-cors'})
            .then(async res => res.blob())
            .then(blob => {
            
            const file = new File([blob], fileName, 'image');
            console.log(blob);
            setFile(file);
    // access file here
  })
*/
        console.log(imageUrl);
    }catch(error)
    {
        if(error.response){
            console.log(error.response.status);
            console.log(error.response.data);
        }
        else{
            console.log(error.message);
        }

       /* res.status(400).json({
            success: false,
            error: 'The image could not be generated'
    });*/
}
}
};

    const getData = () => {
		if (blockchain.account !== "" && blockchain.smartContract !== null) {
			dispatch(fetchData(blockchain.account));
		}
	};

    useEffect(() => {
		getData();
	}, [blockchain.account]);


    function enterPressedCallback(promptText) {
        console.log('API call to DALL-E web service with the following prompt [' + promptText + ']');
        setApiError('')
        setIsFetchingImgs(true)
        callDalleService(backendUrl, promptText, imagesPerQuery).then((response) => {
            setQueryTime(response['executionTime'])
            setGeneratedImages(response['serverResponse']['generatedImgs'])
            setGeneratedImagesFormat(response['serverResponse']['generatedImgsFormat'])
            setIsFetchingImgs(false)

            if (notificationsOn) {
                new Notification(
                    "Your DALL-E images are ready!",
                    {
                        body: `Your generations for "${promptText}" are ready to view`,
                        icon: NOTIFICATION_ICON,
                    },
                )
            }
        }).catch((error) => {
            console.log('Error querying DALL-E service.', error)
            if (error.message === 'Timeout') {
                setApiError('Timeout querying DALL-E service (>1min). Consider reducing the images per query or use a stronger backend.')
            } else {
                setApiError('Error querying DALL-E service. Check your backend server logs.')
            }
            setIsFetchingImgs(false)
        })
    }

    function getGalleryContent() {
        if (apiError) {
            return <Typography variant="h5" color="error">{apiError}</Typography>
        }

        if (isFetchingImgs) {
            return <LoadingSpinner isLoading={isFetchingImgs} />
        }

        return <GeneratedImageList generatedImages={generatedImages} generatedImagesFormat={generatedImagesFormat} promptText={promptText} />
    }


    return (
        <div className={classes.root}>
            
            <div className={classes.title}>
                <Typography variant="h3" style={{paddingTop:"20px",}} >
                   WebX {/* Web X <span role="img" aria-label="sparks-emoji">✨</span> */}
                </Typography>
            </div>

           
            <div style={{fontSize:"30px"}}>
                Please enter text to generate the Image
                <br/>
                <div style={{paddingTop:"20px", paddingBottom:"10px",}}>
                <input style={{paddingTop:"10px", paddingBottom:"10px", paddingLeft:"60px"}}  type="text" id="textToGenerate">
                </input> &nbsp;&nbsp;
                <button style={{ borderRadius:"15px", padding:"9px", fontSize:"17px" , fontFamily:"fantasy"}} 
                onClick={(e)=> {generateImage()}}>Generate Images</button>
                </div>
            </div>
            <div style={{fontSize:"20px"}}>
                <br/>
                Generate Image Display section
                <br/>
                <div >
                    <img src="" id="imgHome"/>
                    <canvas id="canV"></canvas>
                </div>
            </div>
            <br/>
            <br/>
            <br/>
            <br/>
            <div>
                <button style={{ borderRadius:"15px", padding:"9px", fontSize:"17px" , fontFamily:"fantasy"}} onClick={sendFileToIPFS} >Mint NFT</button>
1            </div>
            <br/>
        </div>
    )
}

export default withStyles(useStyles)(HomePage);
