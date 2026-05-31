export const OVERVIEW = /* GraphQL */ `{
  ipassets(first: 1000) { id }
  derivativeLinks(first: 1000) { id }
  royaltyPayments(first: 1000) { id amount }
}`;

export const TOP_IPS = /* GraphQL */ `{
  byDerivatives: ipassets(first: 10, orderBy: derivativeCount, orderDirection: desc) {
    id derivativeCount royaltyPaidTotal
  }
  byRoyalty: ipassets(first: 10, orderBy: royaltyPaidTotal, orderDirection: desc) {
    id royaltyPaidTotal derivativeCount
  }
}`;

export const IP_LINEAGE = /* GraphQL */ `query Lineage($id: ID!, $idStr: String!) {
  ipasset(id: $id) {
    id uri parentCount derivativeCount royaltyPaidTotal
    parents { parent { id } licenseTermsIds }
    derivatives { child { id } }
    attachedTerms { licenseTermsId }
  }
  royaltyPayments(where: { receiverIp: $idStr }, first: 50, orderBy: timestamp, orderDirection: desc) {
    token amount timestamp
  }
}`;
