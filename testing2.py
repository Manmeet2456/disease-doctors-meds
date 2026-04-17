import heapq

class Solution:
    def kClosest(self, points: list[list[int]], k: int) -> list[list[int]]:
        # Max-heap to store the k closest points
        # We store distances as negative because Python's heapq is a min-heap
        max_heap = []
        
        for (x, y) in points:
            # Calculate squared Euclidean distance
            dist = -(x**2 + y**2)
            
            if len(max_heap) < k:
                heapq.heappush(max_heap, (dist, x, y))
            else:
                # If current point is closer than the farthest point in our heap
                if dist > max_heap[0][0]:
                    heapq.heapreplace(max_heap, (dist, x, y))
        
        # Return only the coordinates
        return [[x, y] for (dist, x, y) in max_heap]

# Example Usage:
# solver = Solution()
# print(solver.kClosest([[1,3],[-2,2]], 1))  # Output: [[-2,2]]
