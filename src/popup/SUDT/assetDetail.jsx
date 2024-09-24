import TokenHeader from "../header/tokenHeader";
import Balance from "../account/balance";
import Activities from "../account/activities";
import { useTranslation } from "react-i18next";

export default function AssetDetail() {
  const { t } = useTranslation();

  return (
    <div>
      <TokenHeader title={t("popup.assets.Assets")} />
      <Balance />
      <Activities />
    </div>
  );
}
