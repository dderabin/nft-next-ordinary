import invariant from "tiny-invariant";
import { contractKeys } from "../cache-keys";
import {
  useMutationWithInvalidate,
  useQueryWithNetwork,
} from "./query/useQueryWithNetwork";

export function useContractMetadata(contract) {
  return useQueryWithNetwork(
    contractKeys.detail(contract?.getAddress()),
    async () => await contract?.metadata.get(),
    {
      enabled: !!contract && !!contract?.getAddress(),
    },
  );
}

export function useContractMetadataMutation(contract) {
  return useMutationWithInvalidate(
    async (metadata) => {
      invariant(contract, "contract is required");
      invariant(contract.metadata, "contract metadata is required");
      return await contract.metadata.update(metadata);
    },
    {
      onSuccess: (_data, _variables, _options, invalidate) => {
        return invalidate([contractKeys.detail(contract?.getAddress())]);
      },
    },
  );
}
