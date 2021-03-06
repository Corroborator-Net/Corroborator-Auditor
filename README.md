# Corroborator Auditor Interface

_Open & Trustless Data Verification_

* * *

## Table of Contents

-   [Overview](#overview)
-   [Demo Walkthough](#demo-walkthough)
    -   [Hosted Demo](#hosted-demo)
    -   [Local Demo](#local-demo)
-   [Data Validation](#data-validation)
    -   [Alternative Open Source Validation Tools](#alternative-open-source-validation-tools)
-   [Developer Notes](#developer-notes)

## Overview

**Corro**borator Auditor allows you to easily _explore and verify_ files created by the [**Corro**borator Reporter App](https://github.com/Corroborator-Net/Corroborator-Reporter).

With Auditor you can:

-   **Review** verified repoter logbook entries
    -   View images and metadata
    -   View logbook data
-   **Verify** local or remote image files
    -   Upload files and cross-validate integrity & provenance against the logbook data

## Demo Walkthrough

Using **Corro**borator Auditor is easy and intuitive. Here we provide a sample image that we want to audit with our system that you can **run on your machine** - no need to trust us or a hosted service!

* * *

#### Hosted Demo

_If you trust the host, or do not have the ability to download and run the aplication_

We have a published version available for you [at this link]

-   <https://corroborator-net.github.io/>

Open the link above then jump to the [Data Validation](#data-validation) section to continue the walkthrough.

* * *

#### Local Demo

_If you wish to run or install the application on your own machine, you can!_

**Only a browser is required for Auditor users**

1.  Download the latest (`corroborator_auditor-X.X.X.zip`) release from the list here: https://github.com/Corroborator-Net/Corroborator-Auditor/releases

2. Move the file to a new file folder / directory and extract the contents of the `.zip` file.

3. Open `index.html` in a web browser of your choice (right click and `open with...`)

Now jump to the [Data Validation](#data-validation) section to continue the walkthrough.

## Data Validation

For the demo, a pre-deployed audit smart contract on the Ethereum Rinkeby Testnet is used ([details here](https://github.com/Corroborator-Net/Corroborator-Contract)). 

**Important note:** This contact is **hard coded** in our app at the moment! If you want a new audit log created, please reach out to us. *Logbook creation tools are on the very near-term roadmap* 

To test the demo, follow the instructions below:

1. Obtain a correct PIN. The individual sets this PIN they are using the [Reporter app](https://github.com/Corroborator-Net/Corroborator-Reporter), and needs to communicate this to you to view the log entry for these files.
 - This demo logbook has entries that use two different PIN keys:
   - PIN 1 = `superSeceretKey`
   - PIN 2 = `superSecert`
 - *Consider doing all these steps once through for each PIN to get familiar with the user flow.*

2. Change the PIN used to read the logbook by clicking `Set Reporter PIN`, entering the PIN, and then clicking `Set`.

3. In the **Logbook page**, open a reported image by clicking it.
    - *NOTE: If the incorrect PIN is used, you are not able to view the data on the log, or retrieve the image if it exists on the cloud.*

4. Click `Generate Report` to view all metadata and logbook data.
    - *NOTE: the metadata is baked into the image file itself, while the logbook data is stored on a blockchain.*

5. Right click and `Download the Image` to your machine.

6. Return to the logbook table by clicking `Reset`

7. In the **File Check** page, `upload` the image you just downloaded.
    - *NOTE: you MUST use the correct PIN is baked into the image file itself, while the logbook data is stored on a blockchain.*

8. Click `Generate Report` to verify that the image fingerprint is found in the associated logbook

9. Click `Reset` and then upload a different image that was _not_ generated by the [reporter app](https://github.com/Corroborator-Net/Corroborator-Reporter). You should see that there is _no metadata found_ and that the CID for the image is NOT in the logbook.


### Alternative Open Source Validation Tools

As an alternative to _[Corroborator Auditor](https://github.com/Corroborator-Net/Corroborator-Auditor)_, you can still use _[Corroborator Reporter](https://github.com/Corroborator-Net/Corroborator-Reporter)_ to audit  with other 3rd party open source tools:

| Project                                 | Link                                                             | What it Does                                          |
| --------------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------- |
| Ethereum MAINNET Block Explorer         | <https://blockchair.com/>                                        | Figerprint & Data Provenance (Production)             |
| Ethereum RINKEBY TESTNET Block Explorer | <https://rinkeby.etherscan.io/>                                  | Figerprint & Data Provenance (Testing)                |
| IPFS Gateway                            | <https://gateway.pinata.cloud/ipfs/>&lt;PROVIDE_CID_FINGERPRINT> | Fingerprint & Data Validation (online)                |
| IPFS Desktop                            | <https://github.com/ipfs-shipyard/ipfs-desktop>                  | Fingerprint & Data cross-validation Client (download) |
| Text Difference Tool                    | <https://www.diffchecker.com/>                                   | Crosscheck CIDs and Hashes                            |
| AES256 Encryption Tool                    | <https://encode-decode.com/aes256-encrypt-online/>                                   | Decrypt CIDs and Metadata                            |

***NOTE:** You must obtain the fingerprint (CID) of the image if hosted on IPFS, **AND** the PIN (secret) used to encrypt the data logger on the deployed blockchain contract. You must also have access to the source file produced by the [reporter app](https://github.com/Corroborator-Net/Corroborator-Reporter) to do this without the auditor application**

See [Open Validation Tools](#alternative-open-validation-tools) for use in the following setups:

1. Identify the log entry transaction on the deployed audit contract, and the PIN used to encrypt the log data to obtain the true CID. Then manually decrypt the data logged on the contract transaction and extract the CID:
    - At the bottom of the etherscan page, Click to `show more`
    - View the `input data` as `UTF-8`.
    - Copy this text into a decryption tool and supply the correct PIN as the secret.
    - The data is The CID || picture timestamp || location (in that order) and  _should_ be apparent once decrypted.
    - You can also validate the timestamp of the transaction itself to cross-check the provenance of the recorded data.

2. Use an IPFS client and `add` the image source corresponding to the log entry used above and cross-verify that the file indeed has the same CID generated as reported in the logbook. If the image is hosted on IPFS, you can use the CID to do a lookup via a gateway or a client as well.

## Developer Notes

### Installation

Open a `terminal` on a linux machine and run the following commands:

1.  Clone this repository into a directory of your choice:

```bash
#SET YOUR OWN DIRECTORY HERE IN PLACE OF ~:
cd ~
git clone git@github.com:Corroborator-Net/Corroborator-Auditor.git
```

2.  Install the application & dependencies:

```bash
npm install
```

3.  Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
npm run dev
```

### Deploy to a Remote Host

Open a `terminal` on linux and run the following commands:

1.  Add a `gh-pages` remote to git (for us it is git@github.com:Corroborator-Net/Corroborator-Net.github.io.git)

```bash
# If you use SSH to access the remote repo:
git remote add gh-pages git@github.com:Corroborator-Net/Corroborator-Net.github.io.git

# If you use https to access the remote repo:
git remote add gh-pages https://github.com/Corroborator-Net/Corroborator-Net.github.io.git
```

2.  Build the application:

```bash
npm run build
```

2.  Deploy it to your remote host:

```bash
npm run deploy
```

## License

GNU Affero General Public License v3.0

### :heart: Open Source Tools Used

-   [IPFS](https://ipfs.io/): The [JS node](https://js.ipfs.io/)
-   [Atra](https://atra.io/): A Public [Ethereum Blockchain](https://ethereum.org/) Toolset
-   [Quasar](https://quasar.dev): A [Vue](https://vuejs.org/) Webapp Framework
