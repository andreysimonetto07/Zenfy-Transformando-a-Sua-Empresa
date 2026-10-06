import PasswordRecoveryGate from "@/components/PasswordRecoveryGate";

export const metadata={title:"Nova senha | Zenfy",robots:{index:false},referrer:"no-referrer" as const};

export default function RedefinirSenha(){
  return <PasswordRecoveryGate/>;
}
