import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  Button,
  HStack,
  useToast,
  InputGroup,
  InputRightElement,
  IconButton,
  Select,
  Checkbox,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { motion } from 'framer-motion';

const MotionBox = motion(Box);

interface SkinType {
  [key: string]: boolean;
}

interface SkinConcerns {
  [key: string]: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  sex: string;
  country: string;
  password: string;
  confirmPassword: string;
  skinType: SkinType;
  skinConcerns: SkinConcerns;
}

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    age: '',
    sex: '',
    country: '',
    password: '',
    confirmPassword: '',
    skinType: {
      dry: false,
      oily: false,
      combination: false,
      normal: false,
      sensitive: false
    },
    skinConcerns: {
      acne: false,
      aging: false,
      pigmentation: false,
      redness: false,
      dullness: false
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (category: 'skinType' | 'skinConcerns', name: string) => {
    setFormData(prev => {
      const newData = { ...prev };
      if (category === 'skinType') {
        newData.skinType = {
          ...prev.skinType,
          [name]: !prev.skinType[name]
        };
      } else {
        newData.skinConcerns = {
          ...prev.skinConcerns,
          [name]: !prev.skinConcerns[name]
        };
      }
      return newData;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isLogin) {
      // Registration validation
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: 'Passwords do not match',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      try {
        // Format the data for the backend
        const registrationData = {
          email: formData.email,
          password: formData.password,
          first_name: formData.firstName,
          last_name: formData.lastName,
          username: formData.email.split('@')[0],
          age: parseInt(formData.age) || null,
          sex: formData.sex || null,
          country: formData.country || null,
          skin_type: Object.entries(formData.skinType)
            .filter(([_, value]) => value)
            .map(([key]) => key),
          skin_concerns: Object.entries(formData.skinConcerns)
            .filter(([_, value]) => value)
            .map(([key]) => key)
        };

        const response = await fetch('http://127.0.0.1:8000/api/users/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(registrationData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Registration failed');
        }

        if (data.tokens) {
          localStorage.setItem('access_token', data.tokens.access);
          localStorage.setItem('refresh_token', data.tokens.refresh);
        }

        toast({
          title: 'Account created successfully!',
          description: 'Welcome to AI Skin Analyzer',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      } catch (error) {
        toast({
          title: 'Registration failed',
          description: error instanceof Error ? error.message : 'Please try again later',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      // Login logic
      try {
        const response = await fetch('http://127.0.0.1:8000/api/token/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.detail || 'Invalid credentials');
        }

        localStorage.setItem('access_token', data.access);
        localStorage.setItem('refresh_token', data.refresh);

        toast({
          title: 'Login successful!',
          description: 'Welcome back to AI Skin Analyzer',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        navigate('/');
      } catch (error) {
        toast({
          title: 'Login failed',
          description: error instanceof Error ? error.message : 'Please try again later',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Box
      minH="100vh"
      bgGradient="linear(to-r, pink.50, white)"
      py={8}
    >
      <Container maxW="7xl">
        <Box
          bg="white"
          borderRadius="3xl"
          overflow="hidden"
          boxShadow="2xl"
          mx="auto"
        >
          <VStack
            as="form"
            onSubmit={handleSubmit}
            spacing={6}
            align="stretch"
            w="full"
            maxW="500px"
            mx="auto"
            p={8}
          >
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              textAlign="center"
            >
              <Heading 
                fontSize="3xl"
                bgGradient="linear(to-r, pink.400, purple.500)"
                bgClip="text"
                letterSpacing="tight"
                mb={2}
              >
                {isLogin ? 'Welcome Back' : 'Begin Your Skin Journey'}
              </Heading>
              <Text color="gray.600" fontSize="lg">
                {isLogin
                  ? 'Sign in to continue your personalized skin care experience'
                  : 'Create your account for personalized skin analysis'}
              </Text>
            </MotionBox>

            {!isLogin && (
              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>
                <FormControl isRequired>
                  <FormLabel fontWeight="medium">First Name</FormLabel>
                  <Input
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="John"
                    size="lg"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel fontWeight="medium">Last Name</FormLabel>
                  <Input
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Doe"
                    size="lg"
                  />
                </FormControl>
              </SimpleGrid>
            )}

            <FormControl isRequired>
              <FormLabel fontWeight="medium">Email</FormLabel>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="john@example.com"
                size="lg"
              />
            </FormControl>

            {!isLogin && (
              <>
                <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={6}>
                  <FormControl isRequired>
                    <FormLabel fontWeight="medium">Age</FormLabel>
                    <Input
                      name="age"
                      type="number"
                      value={formData.age}
                      onChange={handleInputChange}
                      placeholder="25"
                      size="lg"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontWeight="medium">Sex</FormLabel>
                    <Select
                      name="sex"
                      value={formData.sex}
                      onChange={handleInputChange}
                      placeholder="Select gender"
                      size="lg"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Select>
                  </FormControl>
                </SimpleGrid>

                <FormControl isRequired>
                  <FormLabel fontWeight="medium">Country</FormLabel>
                  <Select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Select country"
                    size="lg"
                  >
                    <option value="MY">Malaysia</option>
                    <option value="SG">Singapore</option>
                    <option value="US">United States</option>
                    <option value="UK">United Kingdom</option>
                    <option value="AU">Australia</option>
                  </Select>
                </FormControl>

                <Box
                  bg="gray.50"
                  p={6}
                  borderRadius="xl"
                  border="2px"
                  borderColor="pink.100"
                >
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    color="pink.600"
                    mb={4}
                  >
                    Skin Profile
                  </Text>
                  <SimpleGrid columns={2} spacing={6}>
                    <FormControl>
                      <FormLabel fontWeight="medium" color="gray.700">
                        Skin Type
                      </FormLabel>
                      <VStack align="start" spacing={3}>
                        {Object.keys(formData.skinType).map((type) => (
                          <Checkbox
                            key={type}
                            isChecked={formData.skinType[type]}
                            onChange={() => handleCheckboxChange('skinType', type)}
                            colorScheme="pink"
                            size="lg"
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </Checkbox>
                        ))}
                      </VStack>
                    </FormControl>
                    <FormControl>
                      <FormLabel fontWeight="medium" color="gray.700">
                        Skin Concerns
                      </FormLabel>
                      <VStack align="start" spacing={3}>
                        {Object.keys(formData.skinConcerns).map((concern) => (
                          <Checkbox
                            key={concern}
                            isChecked={formData.skinConcerns[concern]}
                            onChange={() => handleCheckboxChange('skinConcerns', concern)}
                            colorScheme="pink"
                            size="lg"
                          >
                            {concern.charAt(0).toUpperCase() + concern.slice(1)}
                          </Checkbox>
                        ))}
                      </VStack>
                    </FormControl>
                  </SimpleGrid>
                </Box>
              </>
            )}

            <FormControl isRequired>
              <FormLabel fontWeight="medium">Password</FormLabel>
              <InputGroup size="lg">
                <Input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                />
                <InputRightElement width="4.5rem">
                  <IconButton
                    h="1.75rem"
                    size="sm"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </InputRightElement>
              </InputGroup>
            </FormControl>

            {!isLogin && (
              <FormControl isRequired>
                <FormLabel fontWeight="medium">Confirm Password</FormLabel>
                <InputGroup size="lg">
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                  />
                  <InputRightElement width="4.5rem">
                    <IconButton
                      h="1.75rem"
                      size="sm"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            )}

            <Button
              type="submit"
              size="lg"
              fontSize="md"
              bgGradient="linear(to-r, pink.400, purple.500)"
              color="white"
              _hover={{
                bgGradient: "linear(to-r, pink.500, purple.600)",
                transform: "translateY(-2px)",
                boxShadow: "xl"
              }}
              _active={{
                bgGradient: "linear(to-r, pink.600, purple.700)"
              }}
              transition="all 0.2s"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>

            <HStack justify="center" spacing={2}>
              <Text color="gray.600">
                {isLogin ? "Don't have an account?" : 'Already have an account?'}
              </Text>
              <Button
                variant="link"
                color="pink.500"
                _hover={{ color: 'pink.600' }}
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Auth; 