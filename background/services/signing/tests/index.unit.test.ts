import sinon from "sinon"
import {
  createInternalSignerService,
  createLedgerService,
  createSigningService,
} from "../../../tests/factories"
import SigningService from "../index"

describe("Signing Service Unit", () => {
  let signingService: SigningService
  const sandbox = sinon.createSandbox()

  beforeEach(async () => {
    signingService = await createSigningService()
    await signingService.startService()
    sandbox.restore()
  })

  afterEach(async () => {
    await signingService.stopService()
  })

  describe("deriveAddress", () => {
    it("should use ledger service to derive from a ledger account", async () => {
      const ledgerService = await createLedgerService()
      await ledgerService.startService()
      const deriveAddressStub = sandbox
        .stub(ledgerService, "deriveAddress")
        .callsFake(async () => "")

      signingService = await createSigningService({
        ledgerService: Promise.resolve(ledgerService),
      })
      await signingService.startService()

      await signingService.deriveAddress({
        type: "ledger",
        deviceID: "foo",
        path: "bar",
      })

      expect(deriveAddressStub.called).toBe(true)
    })

    it("should use keyring service to derive from a keyring account", async () => {
      const internalSignerService = await createInternalSignerService()
      const deriveAddressStub = sandbox
        .stub(internalSignerService, "deriveAddress")
        .callsFake(async () => "")

      signingService = await createSigningService({
        internalSignerService: Promise.resolve(internalSignerService),
      })
      await signingService.startService()

      await signingService.deriveAddress({
        type: "keyring",
        keyringID: "foo",
      })

      expect(deriveAddressStub.called).toBe(true)
    })

    it("should error when trying to derive from a read-only account", () => {
      expect(
        signingService.deriveAddress({
          type: "read-only",
        })
      ).rejects.toBeTruthy()
    })
  })
})
