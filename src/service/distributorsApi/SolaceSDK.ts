import { Coverage } from "@solace-fi/sdk"

const coverage = new Coverage(1)

export default class SolaceSDK {
    async getCovers () {
        console.log(await coverage.activeCoverLimit())
    }

}
