import React, { Component, useState } from 'react';
import { Redirect, Link } from 'react-router-dom';
import { EthService } from '@/contracts/EthService';
import styled from 'styled-components';
import { keyframes } from "styled-components";

import MetaMaskLogo from '@/assets/metamask_medium.png';
import TrustTokenLogo from '@/assets/trust-token-round-logo.png';
import BlueRightArrow from '@/assets/blue-right-arrow.png';
import CircleConfirmConnection from '@/assets/circle-confirm-connection.png';

import Modal from 'react-bootstrap/Modal';

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
`;


const Rotate = styled.div`
  display: inline-block;
  animation: ${rotate} 2s linear infinite;
`;


const WaitingToConnectBox = styled.div`
/* Waiting to connect ... */

text-align: center;
height: 18px;
padding: 10px;

/* Caption / Regular 12px */

font-family: Inter;
font-style: normal;
font-weight: normal;
font-size: 12px;
line-height: 18px;
/* identical to box height, or 150% */

text-align: center;

/* N400 - Casper */

color: #9BAABF;

`;


const ConnectToMetaMaskBox = styled.div`
  cursor: pointer;
  background: #FFFFFF;
  box-sizing: border-box;
  border-radius: 2px;
  padding: 60px 10px 60px 10px;
`;


const MetaMaskSpan = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  line-height: 26px;
  color: #061439;
  vertical-align: middle;
`;


function ConnectToMetaMask(props) {
  return (
    <ConnectToMetaMaskBox onClick={e => props.connect()}>
      <div style={{borderRadius: '2px', height: "50px"}}>

        <MetaMaskSpan>
          <img src={MetaMaskLogo} />
          MetaMask
        </MetaMaskSpan>

        <span style={{ verticalAlign: 'middle', float: 'right', marginTop: "10px" }}>
          <img src={BlueRightArrow} />
        </span>
      </div>
    </ConnectToMetaMaskBox>
  )
}


const ConnectWalletBox = styled.div`
  background-color: white;
  padding: 40px 80px;
  text-align: center;
  max-width: 685px;
  margin: 0 auto;

  width: 440px;
  height: 463px;
  background: #FFFFFF;
  border-radius: 8px;
  border: 1px;
  border-color: red;
`;


const Title = styled.div`
  font-weight: 500;
  font-size: 22px;
  line-height: 32px;
  text-align: center;
  color: #061439;
`;


const Subtitle = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 16px;
  line-height: 24px;
  text-align: center;
  color: #7A859E;
`;


const Accept = styled.div`
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 20px;
  text-align: center;
  color: #7A859E;
`;


function ConnectWallet({loading, loginWithMetaMask}) {
    return (
      <Modal.Dialog centered>

        <Modal.Body>
        <ConnectWalletBox>

          <img src={TrustTokenLogo} width='80px' height='80px' />

          <Title>
            {loading ? "Confirm connection" : "Connect wallet" }
          </Title>

          <Subtitle>
            {
              loading
              ? "Open the extension and give access to the app"
              : "To start using TrueRewards"
            }
          </Subtitle>

            {
              loading
              ? (
                  <div style={{height: "150px", padding: "40px"}}> 
                    <Rotate>
                      <img src={CircleConfirmConnection} /> 
                    </Rotate>

                    <WaitingToConnectBox>
                      Waiting to connect&nbsp;...
                    </WaitingToConnectBox>
                  </div>
                )
              : ( <ConnectToMetaMask connect={loginWithMetaMask} /> )
            }

          <Accept>
            By connecting, I accept TrustToken’s 
            <br/>
            <Link to="/terms-of-use"> Terms of Service</Link>
          </Accept>

        </ConnectWalletBox>
        </Modal.Body>
      </Modal.Dialog>
    )
};


class Login extends Component {
  state = {
    loading: false,
    redirectTo: null
  }

  render() {
    if (this.state.redirectTo) {
      return <Redirect push to={this.state.redirectTo} />
    };

    const loginWithMetaMask = () => {
        console.log("loginWithMetaMask: this: " + this);
        if (! EthService.state.metamaskInstalled) {
          this.setState({ loading: true });
          EthService.enableMetamask()
          .then(enableRes => {
            if (enableRes.code === 4001) {
              console.log("MetaMask NOT enabled.");
            } else if (enableRes.code) {
              console.log("MetaMask NOT enabled: " + JSON.stringify(enableRes.code) + ", ::: " + JSON.stringify(enableRes));
            } else {
              console.log("MetaMask enabled!");
              this.setState({ loading: false, redirectTo: `/dashboard` });
            }
          });
        } else {
          this.setState({ loading: false, redirectTo: `/dashboard` });
        }
      }

    return <ConnectWallet loading={this.state.loading} loginWithMetaMask={loginWithMetaMask} />;

  }
}

export default Login
