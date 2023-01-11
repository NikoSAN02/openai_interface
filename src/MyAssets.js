import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

import {
	Button,
} from "@material-ui/core";
import {
	makeStyles,
} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	title1: {
		"&:hover": {
			boxShadow: "0px 1px 10px 2px #f46afc",
			border: "3px groove #490052",
		}
	},
	title: {
		// flex: 1,
		color: "#b1b1b1",
		fontFamily: "Balthazar",
		fontWeight: 500,
		cursor: "pointer",
		marginRight: 10,
		fontSize: 22,
		height: 32,
		textDecoration: "underline",
		textAlign: "center",
	},
	button: {
		height: 40,
		border: "3px solid #562777",
		borderRadius: 5,
		padding: 4,
		fontSize: 9,
		alignItems: "flex-start",
		marginLeft: 5,
		width: 200,
		overflow: "hidden",
		textOverflow: "ellipsis",
		whiteSpace: "nowrap",
		lineHeight: "25px",
		marginRight: "10px",
		"&:hover": {
			boxShadow: "0px 1px 5px 2px #964ec9",
		}
	},

	select1: {
		width: 150,
		color: "white",
		height: 40,
		marginLeft: "auto",
		fontFamily: "Balthazar",
		"&:hover": {
			boxShadow: "0px 1px 5px 2px #964ec9",
			backgroundColor: "#b1b1b1",
		}
	},

	tableRow: {
		display: "flex",
		flexDirection: "column",
	}



}));




function MyAssets() {
	const blockchain = useSelector((state) => state.blockchain);
	const [data, getData] = useState([])

	async function getNFTList() {
		var nfts = await blockchain.smartContract.methods.myAttributes(blockchain.account).call();
		//console.log(nfts);
		var dataValue = [];
		nfts.forEach(function (nfts) {
			//let url = JSON.parse(nfts);
			let url = nfts.toString();
			//alert(url);
			url = url.substring(0, url.length - 2) + "}";
			let jsondata = JSON.parse(url);
			dataValue.push(jsondata);
		})
		getData(dataValue);
		console.log(data.length);
		console.log(data);
		//console.log(data);
	}
	//window.onload = getNFTList();
	const deleteFileFromIPFS = async (e, imageURI,tokenIDtoUpdate) => {

        
		try {
	
			const CID = imageURI.substring(34, imageURI.length);
			alert(CID)
			console.log(CID);
		    //alert(file);
		    var config = {
			method: 'delete',
			url: 'https://api.pinata.cloud/pinning/unpin/' + CID,
			headers: { 
			    'pinata_api_key': `eb2c15a1e531012c7577`,
			    'pinata_secret_api_key': `b1f3886893f991268c0cf07912d3b6f0600f409325e765c44e5941956f7a37fb`,
			   // "Content-Type": "multipart/form-data"
			}
		      };
		      
			const res = await axios(config);

				var xxAddress = "0x376D4aE2Fba5B24984c2ee11B8722CdeB7644382";
					var gasLimitValue = "885000";
					var tokenId = tokenIDtoUpdate;
					var _newMetadata = "empty";
					var _newImageURI = "empty";
					
				    blockchain.smartContract.methods
				    .setMetadata( tokenId, _newMetadata, _newImageURI )
				    .send({
					gasLimit: gasLimitValue,
					to: xxAddress,
					from: blockchain.account,
					
					tokenId: tokenId,
					_newMetadata: _newMetadata,
					_newImageURI: _newImageURI,
				    }) 
			    
		      
		      console.log(res.data);
	
		    //Take a look at your Pinata Pinned section, you will see a new file added to you list.   
	
	
	
		} catch (error) {
		    console.log("Error deleting File from IPFS: ")
		    console.log(error)
		}
	    
	}


	
	useEffect(() => {
		getNFTList();
	}, []);

  return (
	<>
	<h1>Your NFT</h1>
	<tbody>
	   
		
						  {data.map((item, i) => (
					<tr key={i}>
					<td><img src={item.imageURI} /></td>			  
						<td>{item.tokenID}</td>
						<td>{item.description}</td>
						<td>{item.Attributes}</td>
								  <td><Button onClick={(e)=> {deleteFileFromIPFS(e, item.imageURI,item.tokenID)}}>Regenerate </Button></td>		  
					</tr>
                ))}	  
					</tbody>
		</>
  )
}

export default MyAssets