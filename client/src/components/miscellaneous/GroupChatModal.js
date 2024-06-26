import React, { useState, useContext } from "react";
import {
  useDisclosure,
  Button,
  FormControl,
  Input,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import { ThemeContext } from "../../Context/ThemeContext";
const GroupChatModal = ({ children }) => {
  const { theme } = useContext(ThemeContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { user, chats, setChats } = ChatState();

  const handleSearch = async (query) => {
    setSearch(query);
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `/api/user/register?search=${search}`,
        config
      );
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
  };

  const handleSubmit = async () => {
    if (!groupChatName || !selectedUsers) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );
      setChats([data, ...chats]);
      onClose();
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "failed to create the Chat",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
    // const handleDelete = () => {};
    // Add your submit logic here
  };
  const handleGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    setSelectedUsers([...selectedUsers, userToAdd]);
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>
      <Modal isOpen={isOpen} onClose={onClose} className="flex">
        <ModalOverlay className={`opacity-50 ${theme === "dark" ? "" : ""}`} />
        <ModalContent
          className={` rounded-xl px-5 ${
            theme === "dark" ? "bg-black text-white" : "bg-green-400 text-black"
          } flex items-center`}
          width="30%"
          marginLeft="35%"
          marginTop="9%"
        >
            <ModalCloseButton className="text-blue-500 hover:text-blue-700" marginLeft="90%" marginTop="5%" />
          <ModalHeader
            className="font-semibold py-4 px-6 text-center"
            fontSize="25px"
            fontFamily="Work sans"
          >
            Create a Group Chat
          </ModalHeader>
          <ModalBody d="flex" flexDir="column" alignItems="center">
            <Box overflowY="auto" maxHeight="60vh">
              {" "}
              {/* Add a scrollbar */}
              <FormControl>
                <Input
                  className={`rounded-md p-2 px-3 ${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                  placeholder="Group Name"
                  mb={3}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <Input
                  className={`rounded-md p-2 px-3 ${
                    theme === "dark"
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                  placeholder="Add Users"
                  mb={1}
                  mt={2}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </FormControl>
              <Box w="100%" d="flex" flexWrap="wrap">
                {selectedUsers.map((u) => (
                  <UserBadgeItem
                    key={u._id}
                    user={u}
                    handleFunction={() => handleDelete(u)}
                  />
                ))}
              </Box>
              {loading ? (
                <div>Loading...</div>
              ) : (
                searchResult
                  ?.slice(0, 4)
                  .map((user) => (
                    <UserListItem
                      key={user._id}
                      user={user}
                      handleFunction={() => handleGroup(user)}
                    />
                  ))
              )}
            </Box>
          </ModalBody>
          <ModalFooter className="py-4 px-6 flex justify-end">
            <Button
              className="mr-3 p-2 px-3 rounded-lg bg-blue-500"
              onClick={handleSubmit}
            >
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
