import { Button, Card, Center, Input, Stack } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";
import { useState } from "react";

/** 
 * Sign up component of pages/auth.js
 * @returns signup jsx component
 */
export default function SignUp() {
    const [username,setUsername] = useState("");
    const [password,setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState('');

    /** 
     * when the user clicks submit, it checks if the passwords match, then it sends it to the database, 
     * if the user already exists signupAuth.js will return an error of user already exists so the user knows
     */
    const handleSubmit = async () => {
      
        console.log(username,password);
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
          }
        const res = await fetch('/api/auth/signupAuth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        });
      
        const data = await res.json();
      
        if (res.ok) {
          alert('success');
   
        } else {
          alert(data.message); 
        }
      };











  return (
    <>
      <Card.Root maxW="sm">
        <Card.Header>
          <Card.Description>
            Fill in the form below to create an account
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Stack gap="4" w="full">
            <Field label="Username">
              <Input 
              onChange={(e) => setUsername(e.target.value)}/>
            </Field>
            <Field label="Password">
              <Input 
              onChange={(e) => setPassword(e.target.value)}/>
            </Field>
            <Field label="Confirm Password">
              <Input 
              onChange={(e) => setConfirmPassword(e.target.value)}/>
            </Field>
          </Stack>
        </Card.Body>
        <Card.Footer justifyContent="flex-end">
          <Button variant="outline">Cancel</Button>
          <Button variant="solid" onClick={handleSubmit}>Sign in</Button>
        </Card.Footer>
      </Card.Root>
    </>
  );
}
