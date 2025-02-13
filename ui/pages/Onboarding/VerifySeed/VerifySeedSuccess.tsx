import React, { ReactElement } from "react"
import { useHistory } from "react-router-dom"
import { importSigner } from "@tallyho/tally-background/redux-slices/internal-signer"
import { useTranslation } from "react-i18next"
import { selectCurrentNetwork } from "@tallyho/tally-background/redux-slices/selectors"
import {
  SignerImportSource,
  SignerSourceTypes,
} from "@tallyho/tally-background/services/internal-signer"
import { AsyncThunkFulfillmentType } from "@tallyho/tally-background/redux-slices/utils"
import SharedButton from "../../../components/Shared/SharedButton"
import { useBackgroundDispatch, useBackgroundSelector } from "../../../hooks"
import { OnboardingBox, OnboardingMessageHeader } from "../styles"

function VerifySeedSuccess({
  mnemonic,
  nextPage = "/",
}: {
  mnemonic: string[]
  nextPage?: string
}): ReactElement {
  const { t } = useTranslation("translation", {
    keyPrefix: "onboarding.seedVerification",
  })
  const dispatch = useBackgroundDispatch()
  const selectedNetwork = useBackgroundSelector(selectCurrentNetwork)

  const history = useHistory()

  return (
    <>
      <div className="onboarding_box">
        <div className="message_header">
          <img
            className="message_icon"
            src="./images/message_correct.png"
            alt="correct"
          />
          <span>{t("successMessage")}</span>
        </div>
        <p>{t("successExplainer")}</p>
      </div>
      <SharedButton
        size="medium"
        type="primary"
        onClick={async () => {
          const { success } = (await dispatch(
            importSigner({
              type: SignerSourceTypes.keyring,
              mnemonic: mnemonic.join(" "),
              source: SignerImportSource.internal,
              path: selectedNetwork.derivationPath ?? "m/44'/60'/0'/0",
            })
          )) as unknown as AsyncThunkFulfillmentType<typeof importSigner>

          if (success) history.push(nextPage)
        }}
      >
        {t("successButton")}
      </SharedButton>
      <style jsx>
        {`
          .onboarding_box {
            ${OnboardingBox}
            padding-top: 20px;
          }

          .message_header {
            ${OnboardingMessageHeader}
            color: var(--success);
          }
          .message_icon {
            margin-right: 20px;
            height: 54px;
          }
        `}
      </style>
    </>
  )
}

export default VerifySeedSuccess
