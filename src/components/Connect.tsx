import React from 'react'
import {
	EthereumClient,
	w3mConnectors,
	w3mProvider,
} from '@devprotocol/web3-esbundle/web3modal/ethereum'
import { Web3Modal } from '@devprotocol/web3-esbundle/web3modal/react'
import { configureChains, createConfig, WagmiConfig } from 'wagmi'
import { polygon, polygonMumbai, mainnet } from 'wagmi/chains'
import { ConnectButton, type ConnectButtonProps } from './ConnectButton'

export type ConnectProps = {
	readonly projectId: string
	readonly chainId?: number
} & ConnectButtonProps

export const Connect = ({ projectId, ...props }: ConnectProps) => {
	const chains = [
		props.chainId === 137
			? polygon
			: props.chainId === 80001
			? polygonMumbai
			: props.chainId === 1
			? mainnet
			: polygon,
	]
	const { publicClient } = configureChains(chains, [w3mProvider({ projectId })])
	const wagmiConfig = createConfig({
		autoConnect: true,
		connectors: w3mConnectors({ projectId, chains }),
		publicClient,
	})
	const ethereumClient = new EthereumClient(wagmiConfig, chains)

	return (
		<>
			<WagmiConfig config={wagmiConfig}>
				<ConnectButton {...props} />
			</WagmiConfig>

			<Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
		</>
	)
}
