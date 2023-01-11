import HomePage from "./HomePage";
import MyAssets from "./MyAssets";
import React, { useEffect, useState, useRef, Component } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchData } from "./redux/data/dataActions";
import { connect } from "./redux/blockchain/blockchainActions";
import Web3 from 'web3/dist/web3.min.js';
import logo from './assets/images/logo-medium2.png';
import fantom_logo from "./assets/images/fantom_logo.jpg";
import harmony_logo from "./assets/images/harmony logo.jpg";
import { useNavigate } from "react-router-dom";
import {AppBar,Container,Menu,MenuItem,Select,Button,Toolbar,Typography,} from "@material-ui/core";
import {createTheme,makeStyles,ThemeProvider,} from "@material-ui/core/styles";
import discord from "./assets/images/discord.png";
import twitter from "./assets/images/twitter.png";

const useStyles = makeStyles((theme) => ({
	title: {
		// Left Buttons,
		fontFamily: "Balthazar",
		fontWeight: 500,
		marginRight: -42,
		marginLeft: -20,
		fontSize: 19,
		height: 30,	
	},
	// Right ButtonsAddress , Balance Button ;
	select1: {
		width: 150,
		fontFamily: "Balthazar",
		"&:hover": {
			boxShadow: "0px 2px 5px 3px #964ec9",
			backgroundColor: "#9958e4",
		}
	}



}));

const darkTheme = createTheme({
	palette: {
		primary: {
			main: "#3b214f",
		},
		type: "dark",
	},
});

var networkName = "None";

const networks = {
	FTM: {
	  chainId: `0x${Number(4002).toString(16)}`,
	  chainName: "Fantom Opera Testnet",
	  nativeCurrency: {
	    name: "fantom",
	    symbol: "FTM",
	    decimals: 18
	  },
	  rpcUrls: ["https://rpc.testnet.fantom.network/"],
	  blockExplorerUrls: ["https://testnet.ftmscan.com/"]
	}
      };

      const changeNetwork = async ({ networkName, setError }) => {
	try {
	  if (!window.ethereum) throw new Error("No crypto wallet found");
	  await window.ethereum.request({
	    method: "wallet_addEthereumChain",
	    params: [
	      {
		...networks[networkName]
	      }
	    ]
	  });
	  
	} catch (err) {
	  console.log(err.message);
	}
      };



function Header() {
	const classes = useStyles();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const blockchain = useSelector((state) => state.blockchain);
	const data = useSelector((state) => state.data);
	const [feedback, setFeedback] = useState("Reveal What Your Destiny Holds!");
	const [claimingNft, setClaimingNft] = useState(false);

	const [selectedIndex, setSelectedIndex] = React.useState(1);


	const [counter, setCounter] = useState(1);
	const incrementCounter = () => setCounter(counter + 1);
	let decrementCounter = () => setCounter(counter - 1);
	if (counter <= 1) {
		decrementCounter = () => setCounter(1);
	}



	var accountSelected = "";

	const getData = () => {
		if (blockchain.account !== "" && blockchain.smartContract !== null) {
			dispatch(fetchData(blockchain.account));

			accountSelected = blockchain.account;

			document.getElementById('accountHolder').textContent = accountSelected;
			getBalance();

		}
	};

	async function getBalance() {
		var address, wei, balance;
		//var Web3 = require('web3');
		var web3 = new Web3(Web3.givenProvider);

		address = document.getElementById('accountHolder').textContent;
		//alert("inside get balance");
		//alert(address);
		balance = await web3.eth.getBalance(address);
		//alert(balance);
		document.getElementById("accountBalance").textContent = Math.round(web3.utils.fromWei(balance, 'ether') * 10) / 10 + " " + networkName;

	}




	useEffect(() => {
		getData();
	}, [blockchain.account]);


	function Display(props) {
		return (
			<text style={{ marginLeft: '.5rem' }} >{props.message}</text>
		)
	}



	const [error, setError] = useState();
	const handleNetworkSwitch = async (networkName) => {
		setError();
		await changeNetwork({ networkName, setError });
		dispatch(connect());
	  	getData();
		
	};

	const networkChanged = (chainId) => {
	console.log({ chainId });
	};

	useEffect(() => {
	//window.ethereum.on("chainChanged", networkChanged);

	return () => {
	//window.ethereum.removeListener("chainChanged", networkChanged);
	};
	}, []);

	return (
		<nav className="navbar">

		<input type="checkbox" id="toggler"/>
		<label for="toggler"><i classname="ri-menu-line"></i></label>
		<ThemeProvider theme={darkTheme}>
			<AppBar color="primary" position="dynamic">
					<Container>
					
					<Toolbar style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
						

						
						{/* <div style={{
							width: "0%", display: "flex",
							justifyContent: "flex-end",
						}}>
							<a className="logo">
							 <a className="cursor" href="https://c.tenor.com/W5Or9vSpgCAAAAAC/pepe-wink-pepe.gif" target={"blank"}><img style={{textAlign: "left", width: 65, height: "100%",objectFit: "cover",}} src={logo} /></a>	
							</a>
						</div> */}

						<div class="pulse" style={{
							width: "9.2%",
							fontFamily: "Balthazar",
							display:"flex",
							justifyContent:"left",

						}}>
							<Typography 
								variant="h6"
								className={classes.title} onClick={() => navigate('/HomePage')}
							>
								Home Page
							</Typography>
						</div>

						

						<div class="pulse" id='myAssetsLink' style={{
							width: "11.5%",
							fontFamily: "Balthazar",
							display:"flex",
							justifyContent:"left",
							marginLeft:"-200px",
						}}>
							<Typography 
								variant="h6"
								className={classes.title} onClick={() => navigate('/MyAssets')}
							>
								My Assets
							</Typography>
						</div>
						
						
										
					
										<div style={{
											width: "33%", display: "flex",
											justifyContent: "flex-end"
										}}>
											{/* <img style={{
												width: 40, objectFit: "cover",
											}} src={logo} /> */}
											<div style={{
												height: 40,
												// border: "3px solid #562777",
												// borderRadius: 5,
												padding: 4,
												fontSize: 12,
												alignItems: "flex-start",
												marginLeft: 10,
												width: 8,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
												lineHeight: "25px",
												// boxShadow: "0px 1px 5px 2px #964ec9",
											}}>
												<Typography style={{ marginLeft: 10, alignItems: "flex-start", height: "40" }}
													variant="h7"
				
													id="
													"
												>
												</Typography>
											</div>
											
											<div className="pulse2" >
												<label style={{
													color: '#b1b1b1',
													fontFamily: "Balthazar",
													fontWeight: "bold",
													display:"flex",
													justifyContent:"center",
													marginRight:"100px",
													paddingTop:"20px",
													
												}} id='accountHolder'> Address </label>
												</div>
												<div className="pulse2">
												<label style={{ 
												color: '#b1b1b1', 
												fontFamily: "Balthazar", 
												fontWeight: "bold", 
												boxShadow: "none",
												display:"flex",
												justifyContent:"center",
												paddingRight:"70px", 
												paddingTop:"20px",
												flexWrap:"nowrap",
												border: "0px" }} 
												id='accountBalance' > Balance </label>
												</div>
											
											<div>
											</div>
				
											<Select
												className={classes.select1}
												variant="outlined"
												labelId="demo-simple-select-label"
												id="demo-simple-select"
												label="demo-simple-select"
												displayEmpty
												defaultValue={0}
											>	
												<MenuItem value="0" 
												selected="selected" 
												style={{ fontFamily: "Balthazar" }}>
												Connect Wallet</MenuItem>
												<MenuItem value={"FTM"}
													selected={selectedIndex}
													onClick={(e) => {
													networkName = "FTM";
													e.preventDefault();
													handleNetworkSwitch(networkName);
													
				
												}}><img style={{  marginBottom:-6, width: 24, }} src={fantom_logo} />
				
													<span style={{ marginLeft: 10, fontFamily: "Balthazar" }}>FANTOM</span></MenuItem>
												
											</Select>
										</div>
										
										{/* <a href="https://discord.gg/FSYs9ba2cN" target={"_blank"}><img className="logos" style={{ paddingBottom:"10px", marginRight:"-10px", width: 30, height:"auto" }} src={discord} /></a>
		                                <a href="https://twitter.com/fallacy_V1" target={"_blank"}><img className="logos" style={{ paddingBottom:"10px", marginRight:"-30px",  width:30, height:"auto" }} src={twitter} /></a> */}
					
					</Toolbar>
				</Container>
			</AppBar>
		</ThemeProvider>



		</nav>
	);
}

export default Header;
